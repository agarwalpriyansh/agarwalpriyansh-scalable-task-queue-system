const amqp = require('amqplib');

let channel = null;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        
        // Ensure all queues exist
        await channel.assertQueue('task_queue', { durable: true }); // From API Gateway
        await channel.assertQueue('worker_queue', { durable: true }); // Sent To Golang Workers
        await channel.assertQueue('task_update_queue', { durable: true }); // Sent From Golang workers

        console.log('✅ Connected to RabbitMQ');
    } catch (error) {
        console.error('❌ Failed to connect to RabbitMQ');
        console.error(error.message);
        throw error;
    }
}

function getChannel() {
    if (!channel) throw new Error('RabbitMQ channel not initialized');
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };
