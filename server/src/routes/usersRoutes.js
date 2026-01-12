const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authenticateToken } = require("../middlewares/auth");

// Public - créer un user
router.post("/", usersController.create);

// Protégé - voir MON profil
router.get("/me", authenticateToken, usersController.getMe);

// Protégé - voir tous les users (admin only)
router.get("/", authenticateToken, usersController.getAll);

module.exports = router;
