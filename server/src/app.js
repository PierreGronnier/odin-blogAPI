const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get("/api/test", (req, res) => {
  res.json({
    status: "OK",
    message: "Blog API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
