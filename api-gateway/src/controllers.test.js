const request = require('supertest');
const express = require('express');
const routes = require('./routes');
const mockRabbitMQ = require('./rabbitmq');

jest.mock('./rabbitmq', () => ({
    getChannel: jest.fn(),
    connectRabbitMQ: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Gateway Controllers', () => {
    let mockSendToQueue;

    beforeEach(() => {
        mockSendToQueue = jest.fn();
        mockRabbitMQ.getChannel.mockReturnValue({
            sendToQueue: mockSendToQueue
        });
        
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/request-ride', () => {
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app).post('/api/request-ride').send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Missing required fields');
        });

        it('should return 201 and push to RabbitMQ for valid request', async () => {
            const payload = {
                user_id: 'user123',
                pickup_location: 'Location A',
                dropoff_location: 'Location B'
            };

            const res = await request(app).post('/api/request-ride').send(payload);
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Ride request received');
            expect(res.body.task_id).toBeDefined();
            expect(res.body.status).toBe('PENDING');

            expect(mockSendToQueue).toHaveBeenCalledWith(
                'task_queue',
                expect.any(Buffer),
                { persistent: true }
            );
        });
    });

    describe('GET /api/status/:task_id', () => {
        it('should return status from Ride Service if 200', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ task_id: '123', status: 'ASSIGNED' })
            });

            const res = await request(app).get('/api/status/123');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('ASSIGNED');
        });

        it('should fallback to local cache if Ride Service returns 404', async () => {
            // Populate cache
            const payload = { user_id: 'user2', pickup_location: 'A', dropoff_location: 'B' };
            const postRes = await request(app).post('/api/request-ride').send(payload);
            const taskId = postRes.body.task_id;

            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({})
            });

            const res = await request(app).get(`/api/status/${taskId}`);
            expect(res.status).toBe(200);
            // It should fallback to local memory state which is PENDING
            expect(res.body.status).toBe('PENDING');
        });

        it('should return 500 if network error and no cache', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network Fail'));

            const res = await request(app).get('/api/status/nonexistent123');
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Internal Gateway Server Error');
        });
    });
});
