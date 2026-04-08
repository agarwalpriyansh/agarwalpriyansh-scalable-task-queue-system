const amqp = require('amqplib');

let channel = null;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('task_queue', { durable: true });
        console.log('✅ Connected to RabbitMQ');
    } catch (error) {
        console.error('❌ Failed to connect to RabbitMQ', error);
        console.error('Ensure RabbitMQ is running.');
        // Don't exit immediately in local dev if you want to test routing without RabbitMQ,
        // but for a robust system, we should have a retry or panic.
        process.exit(1); 
    }
}

function getChannel() {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };
