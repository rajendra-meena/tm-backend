const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require("winston");

// Load env vars
dotenv.config();

const app = express();
const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

logger.info("Server started");
logger.error("Database connection failed");

// Body parser
app.use(express.json());

// Enable CORS - configure to allow frontend origin
const whitelist = [process.env.FRONTEND_URL || 'https://digiqly.com'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true);  // Allow all origins for now
        }
    },
    credentials: true
}));

// Set static folder
app.use('/uploads', express.static('uploads'));

// Route files
const auth = require('./Routes/auth');
const drivers = require('./Routes/driver');
const trips = require('./Routes/trip');
const notifications = require('./Routes/notification');
const payments = require('./Routes/payment');

const errorHandler = require('./Middleware/error');

// Mount routers
app.get('/', (req, res) => {
    res.send('Transport Management System API is running...');
});

app.use('/api/v1/auth', auth);
app.use('/api/v1/drivers', drivers);
app.use('/api/v1/trips', trips);
app.use('/api/v1/notifications', notifications);
app.use('/api/v1/payments', payments);

// Error Handler
app.use(errorHandler);

module.exports = app;
