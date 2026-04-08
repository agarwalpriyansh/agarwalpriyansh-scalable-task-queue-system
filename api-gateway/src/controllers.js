const crypto = require('crypto');
const { getChannel } = require('./rabbitmq');

// In-memory mock for task states temporarily. 
// In a real system, the Ride Service or a Redis cache would be queried.
const taskStatusCache = new Map();

const requestRide = async (req, res) => {
    try {
        const { user_id, pickup_location, dropoff_location } = req.body;
        
        if (!user_id || !pickup_location || !dropoff_location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const task_id = crypto.randomUUID();
        const taskPayload = {
            task_id,
            user_id,
            pickup_location,
            dropoff_location,
            status: 'PENDING',
            timestamp: new Date().toISOString()
        };

        // Push to RabbitMQ task queue
        const channel = getChannel();
        channel.sendToQueue(
            'task_queue', 
            Buffer.from(JSON.stringify(taskPayload)), 
            { persistent: true }
        );

        // Save to local cache for status endpoint mock
        taskStatusCache.set(task_id, 'PENDING');

        return res.status(201).json({
            message: 'Ride request received',
            task_id,
            status: 'PENDING'
        });
    } catch (error) {
        console.error('Error requesting ride:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getRideStatus = (req, res) => {
    const { task_id } = req.params;
    if (!task_id) {
        return res.status(400).json({ error: 'Missing task_id' });
    }

    const status = taskStatusCache.get(task_id);
    if (!status) {
        // Provide a generic response if not found in local mock cache
        return res.status(404).json({ error: 'Task not found or status unknown' });
    }

    return res.status(200).json({
        task_id,
        status
    });
};

module.exports = { requestRide, getRideStatus };
