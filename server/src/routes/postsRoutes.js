const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const { authenticateToken, authorizeRoles } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createPostValidator,
  updatePostValidator,
} = require("../validators/postsValidator");

// Public routes
router.get("/", postsController.getAll);
router.get("/:id", postsController.getOne);

// Protected routes (authenticated users only)
router.post(
  "/",
  authenticateToken,
  createPostValidator,
  validate,
  postsController.create,
);

router.put(
  "/:id",
  authenticateToken,
  updatePostValidator,
  validate,
  postsController.update,
);

router.delete("/:id", authenticateToken, postsController.delete);

// Route pour le 2ème front (l'interface de gestion)
router.get(
  "/admin/list",
  authenticateToken,
  authorizeRoles("ADMIN"),
  postsController.getAllForAdmin,
);

// Admin only routes
router.put(
  "/:id/admin",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updatePostValidator,
  validate,
  postsController.adminUpdate,
);

router.delete(
  "/:id/admin",
  authenticateToken,
  authorizeRoles("ADMIN"),
  postsController.adminDelete,
);

router.put(
  "/:id/publish",
  authenticateToken,
  authorizeRoles("ADMIN"),
  postsController.publish,
);

router.put(
  "/:id/unpublish",
  authenticateToken,
  authorizeRoles("ADMIN"),
  postsController.unpublish,
);

module.exports = router;
