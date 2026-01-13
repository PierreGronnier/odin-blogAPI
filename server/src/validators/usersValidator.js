const { body } = require("express-validator");

const registerValidator = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

module.exports = { registerValidator };
