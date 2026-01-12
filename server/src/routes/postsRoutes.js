const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const { authenticateToken } = require("../middlewares/auth"); // ← IMPORTANT !

// Public
router.get("/", postsController.getAll);

// Protégé (besoin de token)
router.post("/", authenticateToken, postsController.create); // ← Ajoute le middleware !

module.exports = router;
