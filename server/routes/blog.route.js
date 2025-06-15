const express = require("express");
const blogController = require("../controllers/blog.controller");
const {
  authenticateJWT,
} = require("../middlewares/authenticate-jwt.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { blogValidation } = require("../utils/validator.util");
const uploadMiddleware = require("../middlewares/cloudinary-upload.middleware");

const router = express.Router();

router.get(
  "/me",
  authenticateJWT,
  validate(blogValidation.authorBlogs, "query"),
  blogController.getMyBlogPosts
);
router.get("/me/:id", authenticateJWT, blogController.getMyBlogPost);

router.get(
  "/",
  validate(blogValidation.publicBlogs, "query"),
  blogController.getBlogPosts
);
router.get("/:id", blogController.getBlogPost);

router.use(authenticateJWT);

router.post(
  "/me",
  uploadMiddleware.single("file"),
  validate(blogValidation.createBlog),
  blogController.createBlogPost
);
router.patch("/me/:id/publish", blogController.publishBlogPost);
router.put(
  "/me/:id",
  uploadMiddleware.single("file"),
  validate(blogValidation.updateBlog),
  blogController.updateBlogPost
);
router.delete("/me/:id", blogController.deleteBlogPost);

module.exports = router;
