const { body } = require("express-validator");

const createCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 and 1000 characters"),

  body("postId")
    .trim()
    .notEmpty()
    .withMessage("Post ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Post ID must be between 1 and 50 characters"),

  body("author")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Author name must be between 1 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email is invalid (only for anonymous comments)")
    .normalizeEmail(),
];

const updateCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 and 1000 characters"),

  body("postId")
    .optional()
    .custom(() => {
      throw new Error("Post ID cannot be changed");
    }),

  body("author")
    .optional()
    .custom(() => {
      throw new Error("Author cannot be changed");
    }),

  body("email")
    .optional()
    .custom(() => {
      throw new Error("Email cannot be changed");
    }),
];

module.exports = {
  createCommentValidator,
  updateCommentValidator,
};
