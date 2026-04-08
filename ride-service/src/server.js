require('dotenv').config();
const express = require('express');
const { initDB, pool } = require('./db');
const { connectRabbitMQ } = require('./rabbitmq');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

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

async function startService() {
    console.log('🚀 Starting Ride Service...');
    await initDB();
    await connectRabbitMQ();
    app.listen(PORT, () => {
        console.log(`📡 Ride Service API running on port ${PORT}`);
    });
}

startService().catch((err) => {
    console.error('💥 Critical Engine Failure:', err.message);
    process.exit(1);
});
