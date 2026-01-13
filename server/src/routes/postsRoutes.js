const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const { authenticateToken } = require("../middlewares/auth");

// Public | GET /api/posts/
router.get("/", postsController.getAll);

// Protégé (besoin de token) | POST /api/posts/
router.post("/", authenticateToken, postsController.create);
module.exports = router;
