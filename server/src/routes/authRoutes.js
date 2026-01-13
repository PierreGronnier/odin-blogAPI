const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { registerValidator } = require("../validators/usersValidator");
const validate = require("../middlewares/validate");

// POST /api/auth/register
router.post("/register", registerValidator, validate, authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
