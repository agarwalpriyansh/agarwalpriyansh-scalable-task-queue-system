const request = require('supertest');
const { app } = require('./server');
const { pool } = require('./db');
const { connectRabbitMQ } = require('./rabbitmq');

jest.mock('./db', () => ({
    pool: { query: jest.fn() },
    initDB: jest.fn()
}));

jest.mock('./rabbitmq', () => ({
    connectRabbitMQ: jest.fn()
}));

describe('Ride Service API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /rides/:task_id', () => {
        it('should return 404 if ride not found', async () => {
            const mockPool = require('./db').pool;
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app).get('/rides/123');
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Ride not found or not yet completed');
            expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM completed_rides WHERE task_id = $1', ['123']);
        });

        it('should return 200 with result if ride found', async () => {
            const mockRide = { task_id: '123', status: 'COMPLETED' };
            const mockPool = require('./db').pool;
            mockPool.query.mockResolvedValueOnce({ rows: [mockRide] });

            const response = await request(app).get('/rides/123');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRide);
        });

        it('should return 500 on database execution error', async () => {
            const mockPool = require('./db').pool;
            mockPool.query.mockRejectedValueOnce(new Error('DB Error'));

            const response = await request(app).get('/rides/123');
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });
});
