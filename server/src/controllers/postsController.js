const postsService = require("../services/postsService");

const postsController = {
  async getAll(req, res) {
    try {
      const posts = await postsService.findAll();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      console.log("Creating post for user:", req.user);

      const postData = {
        ...req.body,
        authorId: req.user.userId,
      };

      const newPost = await postsService.create(postData);
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = postsController;
