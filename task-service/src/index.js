require('dotenv').config();
const { initDB } = require('./db');
const { connectRabbitMQ } = require('./rabbitmq');
const { startConsumers } = require('./worker');

async function startService() {
    console.log('🚀 Starting Task Service (Broker)...');
    
    // Connect DB
    await initDB();
    
    // Connect Message Broker
    await connectRabbitMQ();
    
    console.log('👷 Initializing Consumers...');
    await startConsumers();
    
    console.log('✅ Task Service is running natively.');
}

startService().catch((err) => {
    console.error('💥 Critical Engine Failure:', err.message);
    process.exit(1);
});
