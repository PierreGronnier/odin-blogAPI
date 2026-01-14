const { body } = require("express-validator");

const createPostValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .escape(),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters")
    .escape(),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean")
    .toBoolean(),
];

const updatePostValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .escape(),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters")
    .escape(),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean")
    .toBoolean(),
];

module.exports = { createPostValidator, updatePostValidator };
