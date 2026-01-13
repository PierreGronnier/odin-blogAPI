const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authenticateToken, authorizeRoles } = require("../middlewares/auth");

// Public - créer un user | POST /api/users/
router.post("/", usersController.create);

// Protégé - voir MON profil | GET /api/users/me
router.get("/me", authenticateToken, usersController.getMe);

// Protégé - voir tous les users (admin only) | GET /api/users/
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  usersController.getAll
);

module.exports = router;
