const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// API Routes
const auth = require('./Routes/auth');
const drivers = require('./Routes/driver');
const trips = require('./Routes/trip');
const notifications = require('./Routes/notification');
const payments = require('./Routes/payment');

app.get('/', (req, res) => {
    res.send('Transport Management System API is running...');
});

app.use('/api/v1/auth', auth);
app.use('/api/v1/drivers', drivers);
app.use('/api/v1/trips', trips);
app.use('/api/v1/notifications', notifications);
app.use('/api/v1/payments', payments);

// Serve front-end's index.html for any unmatched routes (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Error Handler
const errorHandler = require('./Middleware/error');
app.use(errorHandler);

module.exports = app;
