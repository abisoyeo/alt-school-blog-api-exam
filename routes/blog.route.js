const express = require("express");
const blogController = require("../controllers/blog.controller");
const {
  authenticateJWT,
} = require("../middlewares/authenticate-jwt.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { blogValidation } = require("../utils/validator.util");

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
  "/",
  validate(blogValidation.createBlog),
  blogController.createBlogPost
);
router.patch("/:id/publish", blogController.publishBlogPost);
router.put(
  "/:id",
  validate(blogValidation.updateBlog),
  blogController.updateBlogPost
);
router.delete("/:id", blogController.deleteBlogPost);

module.exports = router;
