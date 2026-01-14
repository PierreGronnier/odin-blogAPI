const authService = require("../services/authService");
const prisma = require("../config/database");

const authController = {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);

      res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const result = await authService.login(req.body.email, req.body.password);

      res.json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async logout(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      await prisma.user.update({
        where: { id: req.user.userId },
        data: { lastLogoutAt: new Date() },
      });

      res.json({
        message: "Logout successful",
        note: "All tokens issued before this moment are now invalid.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
