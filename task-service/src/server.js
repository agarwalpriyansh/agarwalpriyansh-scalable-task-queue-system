const express = require('express');
const { pool } = require('./db');

const router = express.Router();

// GET /task/get - Fetch a pending task for the worker
router.get('/get', async (req, res) => {
    const client = await pool.connect();
    try {
        // Find one PENDING task
        const result = await client.query(
            'SELECT task_id, user_id, pickup_location, dropoff_location FROM tasks WHERE status = $1 LIMIT 1',
            ['PENDING']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No pending tasks found' });
        }

        const task = result.rows[0];
        res.status(200).json(task);
    } catch (err) {
        console.error('Error fetching task:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

// POST /task/complete - Mark task as completed
router.post('/complete', async (req, res) => {
    const { task_id } = req.query;
    if (!task_id) return res.status(400).json({ error: 'task_id is required' });

    try {
        await pool.query(
            'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2',
            ['COMPLETED', task_id]
        );
        console.log(`✅ Task ${task_id} marked as COMPLETED`);
        res.status(200).json({ message: 'Task completed' });
    } catch (err) {
        console.error('Error completing task:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /task/fail - Mark task as failed
router.post('/fail', async (req, res) => {
    const { task_id } = req.query;
    if (!task_id) return res.status(400).json({ error: 'task_id is required' });

    try {
        await pool.query(
            'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2',
            ['FAILED', task_id]
        );
        console.log(`❌ Task ${task_id} marked as FAILED`);
        res.status(200).json({ message: 'Task failed' });
    } catch (err) {
        console.error('Error failing task:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /task/retry - Mark task for retry
router.post('/retry', async (req, res) => {
    const { task_id } = req.query;
    if (!task_id) return res.status(400).json({ error: 'task_id is required' });

    try {
        await pool.query(
            'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2',
            ['PENDING', task_id]
        );
        console.log(`🔄 Task ${task_id} marked for RETRY`);
        res.status(200).json({ message: 'Task retrying' });
    } catch (err) {
        console.error('Error retrying task:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
