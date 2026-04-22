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

const getRideStatus = async (req, res) => {
    const { task_id } = req.params;
    if (!task_id) {
        return res.status(400).json({ error: 'Missing task_id' });
    }

    try {
        const rideServiceUrl = process.env.RIDE_SERVICE_URL || 'http://localhost:4000';
        const response = await fetch(`${rideServiceUrl}/rides/${task_id}`);
        
        if (response.ok) {
            const data = await response.json();
            return res.status(200).json(data);
        }
        
        // If the Ride Service yields 404, the ride is likely still processing in the active cluster!
        if (response.status === 404) {
            const status = taskStatusCache.get(task_id);
            if (status) {
                return res.status(200).json({ task_id, status });
            }
            return res.status(404).json({ error: 'Task not found or status unknown' });
        }
        
        return res.status(response.status).json({ error: 'Upstream Ride Service Error' });

    } catch (err) {
        console.error('Network Error fetching from Ride Service:', err.message);
        
        // Degrade gracefully utilizing the active processing cache layer if Ride Service network is severed
        const status = taskStatusCache.get(task_id);
        if (status) {
            return res.status(200).json({ task_id, status });
        }
        return res.status(500).json({ error: 'Internal Gateway Server Error' });
    }
};

const registerDriver = async (req, res) => {
    try {
        const { name, latitude, longitude } = req.body;

        if (!name || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Name and coordinates are required' });
        }

        const driver_id = `d-${crypto.randomUUID().slice(0, 8)}`;
        const driverPayload = {
            id: driver_id,
            name,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            status: 'available'
        };

        const driverServiceUrl = process.env.DRIVER_SERVICE_URL || 'http://localhost:8081';
        const response = await fetch(`${driverServiceUrl}/drivers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driverPayload)
        });

        if (response.ok) {
            const data = await response.json();
            return res.status(201).json({
                message: 'Driver successfully registered',
                driver: data
            });
        }

        const errorData = await response.json();
        return res.status(response.status).json({ error: errorData.error || 'Failed to register driver' });

    } catch (error) {
        console.error('Error registering driver:', error);
        return res.status(500).json({ error: 'Internal Gateway Server Error' });
    }
};

module.exports = { requestRide, getRideStatus, registerDriver };
