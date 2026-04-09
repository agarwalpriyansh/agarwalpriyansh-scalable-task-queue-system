const amqp = require('amqplib');
const { connectRabbitMQ } = require('./rabbitmq');
const { pool } = require('./db');

jest.mock('amqplib');
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

describe('RabbitMQ integration in Ride Service', () => {
    let mockChannel, mockConnection;

    beforeEach(() => {
        mockChannel = {
            assertQueue: jest.fn(),
            consume: jest.fn(),
            ack: jest.fn(),
            nack: jest.fn()
        };
        mockConnection = {
            createChannel: jest.fn().mockResolvedValue(mockChannel)
        };
        amqp.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect to RabbitMQ and start consuming from ride_events_queue', async () => {
        await connectRabbitMQ();
        
        expect(amqp.connect).toHaveBeenCalled();
        expect(mockConnection.createChannel).toHaveBeenCalled();
        expect(mockChannel.assertQueue).toHaveBeenCalledWith('ride_events_queue', { durable: true });
        expect(mockChannel.consume).toHaveBeenCalledWith('ride_events_queue', expect.any(Function));
        
        // Retrieve the consume callback
        const consumeCallback = mockChannel.consume.mock.calls[0][1];
        
        const mockPayload = {
            task_id: 'task-1',
            user_id: 'user-1',
            driver_id: 'driver-1',
            pickup_location: 'Loc A',
            dropoff_location: 'Loc B'
        };
        
        const mockMsg = {
            content: Buffer.from(JSON.stringify(mockPayload))
        };
        
        // trigger consumption logic
        await consumeCallback(mockMsg);
        
        const mockClient = await pool.connect();
        expect(mockClient.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO completed_rides'),
            ['task-1', 'user-1', 'driver-1', 'Loc A', 'Loc B', 'COMPLETED']
        );
        expect(mockClient.release).toHaveBeenCalled();
        expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });
});
