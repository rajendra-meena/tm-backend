const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
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
// Railway production: set FRONTEND_URL env var in dashboard, or fallback to allowed origin
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const whitelist = [frontendUrl];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      // Allow whitelisted origins
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // For development: allow the local origin
        if (
          process.env.NODE_ENV === "development" &&
          origin === "http://localhost:3000"
        ) {
          callback(null, true);
        } else {
          callback(null, true); // Allow all in development/production
        }
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Set static folder
app.use("/uploads", express.static("uploads"));

// Route files
const auth = require("./Routes/auth");
const drivers = require("./Routes/driver");
const trips = require("./Routes/trip");
const notifications = require("./Routes/notification");
const payments = require("./Routes/payment");

const errorHandler = require("./Middleware/error");

// Mount routers
app.get("/", (req, res) => {
  res.send("Transport Management System API is running...");
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/drivers", drivers);
app.use("/api/v1/trips", trips);
app.use("/api/v1/notifications", notifications);
app.use("/api/v1/payments", payments);

// Error Handler
app.use(errorHandler);

module.exports = app;
