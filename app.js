const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const winston = require("winston");

dotenv.config();

const app = express();

const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console()],
});

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://digiqly.com",
  "https://www.digiqly.com",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

// Body parser
app.use(express.json());

// Static folder
app.use("/uploads", express.static("uploads"));

// Routes
const auth = require("./Routes/auth");
const drivers = require("./Routes/driver");
const trips = require("./Routes/trip");
const notifications = require("./Routes/notification");
const payments = require("./Routes/payment");

const errorHandler = require("./Middleware/error");

app.get("/", (req, res) => {
  res.status(200).send("Transport Management System API is running...");
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/drivers", drivers);
app.use("/api/v1/trips", trips);
app.use("/api/v1/notifications", notifications);
app.use("/api/v1/payments", payments);

app.use(errorHandler);

module.exports = app;
