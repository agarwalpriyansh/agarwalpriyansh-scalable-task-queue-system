const { startConsumers } = require('./worker');
const { pool } = require('./db');
const mockRabbitMQ = require('./rabbitmq');

jest.mock('./db', () => {
    const mockQuery = jest.fn();
    const mockRelease = jest.fn();
    return {
        pool: {
            connect: jest.fn().mockResolvedValue({
                query: mockQuery,
                release: mockRelease
            })
        }
    };
});

jest.mock('./rabbitmq', () => ({
    getChannel: jest.fn()
}));

describe('Task Service Worker', () => {
    let mockChannel;
    let mockQuery;

    beforeEach(async () => {
        mockChannel = {
            consume: jest.fn(),
            sendToQueue: jest.fn(),
            ack: jest.fn(),
            nack: jest.fn()
        };
        mockRabbitMQ.getChannel.mockReturnValue(mockChannel);
        
        const client = await pool.connect();
        mockQuery = client.query;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should consume from task_queue and save to db then send to worker_queue', async () => {
        await startConsumers();

        const taskQueueConsumeCall = mockChannel.consume.mock.calls.find(c => c[0] === 'task_queue');
        expect(taskQueueConsumeCall).toBeDefined();

        const consumeFn = taskQueueConsumeCall[1];
        
        const payload = { task_id: 't1', user_id: 'u1', pickup_location: 'A', dropoff_location: 'B' };
        const mockMsg = { content: Buffer.from(JSON.stringify(payload)) };

        await consumeFn(mockMsg);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO tasks'),
            ['t1', 'u1', 'A', 'B', 'PENDING']
        );

        expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
            'worker_queue',
            expect.any(Buffer),
            { persistent: true }
        );
        expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });

    it('should consume task_update_queue and handle FAILED by retrying', async () => {
        await startConsumers();

        const updateQueueConsumeCall = mockChannel.consume.mock.calls.find(c => c[0] === 'task_update_queue');
        expect(updateQueueConsumeCall).toBeDefined();

        const consumeFn = updateQueueConsumeCall[1];
        
        const payload = { task_id: 't2', status: 'FAILED', user_id: 'u2', pickup_location: 'C', dropoff_location: 'D' };
        const mockMsg = { content: Buffer.from(JSON.stringify(payload)) };

        await consumeFn(mockMsg);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE tasks SET status = $1'),
            ['FAILED', 't2']
        );
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE tasks SET status = $1'),
            ['PENDING', 't2']
        );

        expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
            'worker_queue',
            expect.any(Buffer),
            { persistent: true }
        );
        expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });
});
