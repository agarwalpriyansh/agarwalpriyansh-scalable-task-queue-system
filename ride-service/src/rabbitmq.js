const amqp = require('amqplib');
const { pool } = require('./db');

let channel = null;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        
        await channel.assertQueue('ride_events_queue', { durable: true });
        console.log('✅ Connected to RabbitMQ [Ride Service]');

        // Listen for new completed ride payloads
        channel.consume('ride_events_queue', async (msg) => {
            if (msg !== null) {
                try {
                    const payload = JSON.parse(msg.content.toString());
                    console.log(`📥 Received completed ride event for task: ${payload.task_id}`);

                    const client = await pool.connect();
                    try {
                        await client.query(
                            'INSERT INTO completed_rides (task_id, user_id, driver_id, pickup_location, dropoff_location, status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (task_id) DO NOTHING',
                            [payload.task_id, payload.user_id, payload.driver_id, payload.pickup_location, payload.dropoff_location, 'COMPLETED']
                        );
                        console.log(`💾 Ride ${payload.task_id} securely saved to database.`);
                    } finally {
                        client.release();
                    }
                    channel.ack(msg);
                } catch (error) {
                    console.error('❌ Error saving ride event:', error);
                    channel.nack(msg);
                }
            }
        });

    } catch (error) {
        console.error('❌ Failed to connect to RabbitMQ');
        throw error;
    }
}

module.exports = { connectRabbitMQ };
