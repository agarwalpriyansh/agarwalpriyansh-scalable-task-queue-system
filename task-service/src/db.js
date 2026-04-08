const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'ride_booking',
    port: process.env.POSTGRES_PORT || 5432,
});

async function initDB() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                task_id UUID PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                pickup_location VARCHAR(255) NOT NULL,
                dropoff_location VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ PostgreSQL Database Initialized');
    } catch (err) {
        console.error('❌ Database initialization error:', err.message);
        console.error('Ensure PostgreSQL is running.');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { pool, initDB };
