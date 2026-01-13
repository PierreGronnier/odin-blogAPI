const authService = require("../services/authService");

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
};

module.exports = authController;
