require('dotenv').config();
const express = require('express');
const { connectRabbitMQ } = require('./rabbitmq');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Startup
async function startServer() {
    console.log('Starting API Gateway...');
    await connectRabbitMQ();
    app.listen(PORT, () => {
        console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
    });
}

startServer();
