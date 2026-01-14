const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { registerValidator } = require("../validators/usersValidator");
const validate = require("../middlewares/validate");
const { authenticateToken } = require("../middlewares/auth");

// POST /api/auth/register
router.post("/register", registerValidator, validate, authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/logout
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
