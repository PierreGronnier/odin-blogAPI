const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const commentsRoutes = require("./routes/commentsRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", commentsRoutes);

// Route de test
app.get("/api/test", (req, res) => {
  res.json({
    status: "OK",
    message: "Blog API is running",
    timestamp: new Date().toISOString(),
  });
});

const notFoundHandler = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
