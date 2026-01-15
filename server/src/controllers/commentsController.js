const commentsService = require("../services/commentsService");

const commentsController = {
  async getAll(req, res) {
    try {
      const comments = await commentsService.findAll();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getOne(req, res) {
    try {
      const comment = await commentsService.findById(req.params.id);
      if (!comment || !comment.approved) {
        return res.status(404).json({ error: "Comment not found" });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { content, postId, author, email } = req.body;

      if (!content || !postId) {
        return res.status(400).json({
          error: "Content and postId are required",
        });
      }

      const postExists = await commentsService.postExists(postId);
      if (!postExists) {
        return res.status(404).json({ error: "Post not found" });
      }

      const commentData = {
        content,
        postId,
        author,
        email,
      };

      const userId = req.user ? req.user.userId : null;

      if (!userId && !author) {
        return res.status(400).json({
          error: "Author is required for anonymous comments",
        });
      }

      const newComment = await commentsService.create(commentData, userId);

      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const comment = await commentsService.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (!comment.userId) {
        return res.status(403).json({
          error: "Anonymous comments cannot be edited",
        });
      }

      if (comment.userId !== req.user.userId) {
        return res.status(403).json({
          error: "You can only edit your own comments",
        });
      }

      const updatedComment = await commentsService.update(req.params.id, {
        content: req.body.content,
      });
      res.json(updatedComment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const comment = await commentsService.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (!comment.userId) {
        return res.status(403).json({
          error: "Anonymous comments cannot be deleted",
        });
      }

      if (comment.userId !== req.user.userId) {
        return res.status(403).json({
          error: "You can only delete your own comments",
        });
      }

      await commentsService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllAdmin(req, res) {
    try {
      const comments = await commentsService.findAllAdmin();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async adminDelete(req, res) {
    try {
      await commentsService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async approve(req, res) {
    try {
      const updatedComment = await commentsService.update(req.params.id, {
        approved: true,
      });
      res.json(updatedComment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = commentsController;
