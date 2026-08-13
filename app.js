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

// -------------------- CORS CONFIG --------------------

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://digiqly.com",
  "https://www.digiqly.com",
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without origin, e.g. Postman/curl/mobile apps
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS BLOCKED ORIGIN:", origin);
    return callback(new Error(`CORS blocked: ${origin}`));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

// Enable CORS globally
app.use(cors(corsOptions));

// Handle all preflight OPTIONS requests
app.options(/.*/, cors(corsOptions));

// -------------------- BODY PARSER --------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- STATIC FILES --------------------

app.use("/uploads", express.static("uploads"));

// -------------------- ROUTES --------------------

const auth = require("./Routes/auth");
const drivers = require("./Routes/driver");
const trips = require("./Routes/trip");
const notifications = require("./Routes/notification");
const payments = require("./Routes/payment");

const errorHandler = require("./Middleware/error");

// -------------------- HEALTH CHECK --------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Transport Management System API is running...",
  });
});

// Optional CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CORS is working",
    origin: req.headers.origin || null,
  });
});

// -------------------- API ROUTES --------------------

app.use("/api/v1/auth", auth);
app.use("/api/v1/drivers", drivers);
app.use("/api/v1/trips", trips);
app.use("/api/v1/notifications", notifications);
app.use("/api/v1/payments", payments);

// -------------------- 404 HANDLER --------------------

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// -------------------- ERROR HANDLER --------------------

app.use(errorHandler);

module.exports = app;
