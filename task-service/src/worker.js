const { pool } = require('./db');
const { getChannel } = require('./rabbitmq');

async function updateTaskStatus(task_id, status) {
    const client = await pool.connect();
    try {
        await client.query(
            'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2',
            [status, task_id]
        );
        console.log(`📝 Task ${task_id} updated to ${status}`);
    } catch (err) {
        console.error(`❌ Error updating task status ${task_id}:`, err.message);
    } finally {
        client.release();
    }
}

async function startConsumers() {
    const channel = getChannel();

    // 1. Consume incoming tasks from API Gateway
    channel.consume('task_queue', async (msg) => {
        if (msg !== null) {
            try {
                const payload = JSON.parse(msg.content.toString());
                console.log(`📥 Received new task: ${payload.task_id}`);

                // Store state in Postgres
                const client = await pool.connect();
                try {
                    await client.query(
                        'INSERT INTO tasks (task_id, user_id, pickup_location, dropoff_location, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (task_id) DO NOTHING',
                        [payload.task_id, payload.user_id, payload.pickup_location, payload.dropoff_location, 'PENDING']
                    );
                } finally {
                    client.release();
                }

                // Dispatch task to workers
                channel.sendToQueue('worker_queue', Buffer.from(JSON.stringify(payload)), { persistent: true });
                console.log(`📤 Task ${payload.task_id} dispatched to worker_queue`);

                channel.ack(msg);
            } catch (error) {
                console.error('❌ Error processing task:', error);
                channel.nack(msg);
            }
        }
    });

    // 2. Consume status updates from Workers (Golang)
    channel.consume('task_update_queue', async (msg) => {
        if (msg !== null) {
            try {
                const update = JSON.parse(msg.content.toString());
                await updateTaskStatus(update.task_id, update.status);

                // Simple Retry logic
                // In production, we'd add 'retry-count' into the payload
                if (update.status === 'FAILED') {
                    console.log(`🔄 Retrying task ${update.task_id}... sending back to worker_queue`);
                    await updateTaskStatus(update.task_id, 'PENDING');
                    
                    // Sending back to worker queue
                    channel.sendToQueue('worker_queue', Buffer.from(JSON.stringify({
                        task_id: update.task_id,
                        user_id: update.user_id,
                        pickup_location: update.pickup_location,
                        dropoff_location: update.dropoff_location,
                        is_retry: true
                    })), { persistent: true });
                }

                channel.ack(msg);
            } catch (err) {
                console.error('❌ Error processing task update:', err);
                channel.nack(msg);
            }
        }
    });
}

module.exports = { startConsumers };
