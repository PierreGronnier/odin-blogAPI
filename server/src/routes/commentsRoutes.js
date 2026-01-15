const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");
const {
  authenticateTokenOptional,
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/auth");
const validate = require("../middlewares/validate");
/*const {
  createCommentValidator,
  updateCommentValidator,
} = require("../validators/commentsValidator");
 */

router.get("/", commentsController.getAll);

router.get("/:id", commentsController.getOne);

router.post(
  "/",
  authenticateTokenOptional,
  /*createCommentValidator,*/
  validate,
  commentsController.create
);

router.put(
  "/:id",
  authenticateToken,
  /*updateCommentValidator,*/
  validate,
  commentsController.update
);

router.delete("/:id", authenticateToken, commentsController.delete);

router.get(
  "/admin/all",
  authenticateToken,
  authorizeRoles("ADMIN"),
  commentsController.getAllAdmin
);

router.put(
  "/:id/admin/approve",
  authenticateToken,
  authorizeRoles("ADMIN"),
  commentsController.approve
);

router.delete(
  "/:id/admin",
  authenticateToken,
  authorizeRoles("ADMIN"),
  commentsController.adminDelete
);

module.exports = router;
