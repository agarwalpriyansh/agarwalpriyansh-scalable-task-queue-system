require('dotenv').config();
const express = require('express');
const { initDB, pool } = require('./db');
const { connectRabbitMQ } = require('./rabbitmq');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'ride-service' }));

// Final internal status API
app.get('/rides/:task_id', async (req, res) => {
    const { task_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM completed_rides WHERE task_id = $1', [task_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ride not found or not yet completed' });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching ride:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create ride record
app.post('/ride/create', async (req, res) => {
    const { task_id, user_id, driver_id, driver_name, pickup_location, dropoff_location } = req.body;
    
    if (!task_id || !user_id || !driver_id || !pickup_location || !dropoff_location) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await pool.query(
            `INSERT INTO completed_rides (task_id, user_id, driver_id, driver_name, pickup_location, dropoff_location, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'COMPLETED') 
             ON CONFLICT (task_id) DO NOTHING`,
            [task_id, user_id, driver_id, driver_name, pickup_location, dropoff_location]
        );
        console.log(`✨ Ride record created for task: ${task_id}`);
        res.status(201).json({ message: 'Ride created successfully' });
    } catch (err) {
        console.error('Error creating ride record:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function startService() {
    console.log('🚀 Starting Ride Service...');
    await initDB();
    await connectRabbitMQ();
    app.listen(PORT, () => {
        console.log(`📡 Ride Service API running on port ${PORT}`);
    });
}

if (require.main === module) {
    startService().catch((err) => {
        console.error('💥 Critical Engine Failure:', err.message);
        process.exit(1);
    });
}

module.exports = { app };
