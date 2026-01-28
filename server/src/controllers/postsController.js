const postsService = require("../services/postsService");

const postsController = {
  async getAll(req, res) {
    try {
      const posts = await postsService.findPublished();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getOne(req, res) {
    try {
      const post = await postsService.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (!post.published) {
        return res
          .status(403)
          .json({ error: "This post is not yet published" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const postData = {
        ...req.body,
        authorId: req.user.userId,
      };

      const newPost = await postsService.create(postData);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const post = await postsService.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.authorId !== req.user.userId) {
        return res
          .status(403)
          .json({ error: "You can only edit your own posts" });
      }

      const updatedPost = await postsService.update(req.params.id, req.body);
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const post = await postsService.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.authorId !== req.user.userId) {
        return res
          .status(403)
          .json({ error: "You can only delete your own posts" });
      }

      await postsService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Admin actions
  async getAllForAdmin(req, res) {
    try {
      const posts = await postsService.findAll();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getOneForAdmin(req, res) {
    try {
      const post = await postsService.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async adminUpdate(req, res) {
    try {
      const updatedPost = await postsService.update(req.params.id, req.body);
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async adminDelete(req, res) {
    try {
      await postsService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async publish(req, res) {
    try {
      const post = await postsService.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const updatedPost = await postsService.update(req.params.id, {
        published: true,
        publishedAt: new Date(),
      });

      res.json({
        message: "Post published successfully",
        post: updatedPost,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async unpublish(req, res) {
    try {
      const post = await postsService.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const updatedPost = await postsService.update(req.params.id, {
        published: false,
        publishedAt: null,
      });

      res.json({
        message: "Post unpublished successfully",
        post: updatedPost,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = postsController;
