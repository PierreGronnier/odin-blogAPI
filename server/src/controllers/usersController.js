const usersService = require("../services/usersService");

const usersController = {
  async create(req, res) {
    try {
      const { email, username, password } = req.body;

      const user = await usersService.createUser({
        email,
        username,
        password,
      });

      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        message: "User created",
        user: userWithoutPassword,
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({
          error: "Email or username already exists",
        });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const users = await usersService.findAll();

      const safeUsers = users.map((user) => {
        const { password, ...rest } = user;
        return rest;
      });

      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMe(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Token required" });
      }

      const user = await usersService.findUserById(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = usersController;
