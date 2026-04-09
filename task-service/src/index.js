require('dotenv').config();
const express = require('express');
const { initDB } = require('./db');
const { connectRabbitMQ } = require('./rabbitmq');
const { startConsumers } = require('./worker');
const taskRoutes = require('./server');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'task-service' }));
app.use('/task', taskRoutes);

async function startService() {
    console.log('🚀 Starting Task Service (Broker + API)...');
    
    // Connect DB
    await initDB();
    
    // Connect Message Broker
    await connectRabbitMQ();
    
    console.log('👷 Initializing Consumers...');
    await startConsumers();
    
    // Start HTTP Server
    app.listen(PORT, () => {
        console.log(`📡 Task Service API running on port ${PORT}`);
    });
    
    console.log('✅ Task Service is running natively.');
}

startService().catch((err) => {
    console.error('💥 Critical Engine Failure:', err.message);
    process.exit(1);
});
