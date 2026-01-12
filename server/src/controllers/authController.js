const authService = require("../services/authService");

const authController = {
  async register(req, res) {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const user = await authService.register({ email, username, password });

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
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const result = await authService.login(email, password);

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
