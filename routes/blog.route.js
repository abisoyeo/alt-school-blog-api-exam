const express = require("express");
const blogController = require("../controllers/blog.controller");
const router = express.Router();

router.post("/", blogController.createBlogPost);
router.get("/", blogController.getBlogPosts);
router.get("/:id", blogController.getBlogPost);
router.put("/:id", blogController.updateBlogPost);
router.delete("/:id", blogController.deleteBlogPost);

module.exports = router;
