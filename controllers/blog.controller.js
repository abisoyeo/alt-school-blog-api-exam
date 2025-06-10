const { SaveTags } = require("../services/tag.service");
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getAllBlogs,
  incrementBlogReadCount,
} = require("../services/blog.service");
const { blogValidation } = require("../utils/validator.util");
const ApiError = require("../utils/api-error.util");

// Create a new blog post
exports.createBlogPost = async (req, res, next) => {
  try {
    const { title, description, body, tags: rawTags } = req.body;

    const tagObjectIds = await SaveTags(rawTags);

    const blogData = {
      title,
      description,
      body,
      tags: tagObjectIds,
      author: "6846bd13ac4628c0114e8e8b",
    };

    const blog = await createBlog(blogData);

    res.status(201).json({
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// Get all blog posts
exports.getBlogPosts = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error, value } = blogValidation.listBlogs.validate(req.query);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const result = await getAllBlogs(value);

    res.status(200).json({
      message: "Published blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog post
exports.getBlogPost = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    const blogPost = await getBlogById(blogId);

    if (!blogPost || blogPost.state !== "published") {
      throw new ApiError(404, "Blog post not found or not published");
    }

    const updatedBlogPost = await incrementBlogReadCount(blogId);

    res.status(200).json({
      message: "success",
      data: updatedBlogPost,
    });
  } catch (error) {
    next(error);
  }
};

// Update blog post
exports.updateBlogPost = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const { title, description, body, state, tags: rawTags } = req.body;

    const existingBlog = await getBlogById(blogId);

    if (!existingBlog) {
      throw new ApiError(404, "Blog not found");
    }

    // Process tags if they are being updated
    let tagObjectIds = existingBlog.tags;
    if (rawTags !== undefined) {
      tagObjectIds = await SaveTags(rawTags);
    }

    // Prepare the update payload
    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (body !== undefined) updatePayload.body = body;
    if (state !== undefined) updatePayload.state = state;
    if (tagObjectIds !== undefined) updatePayload.tags = tagObjectIds;

    const updatedBlog = await updateBlog(blogId, updatePayload);

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// Delete blog post
exports.deleteBlogPost = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    const existingBlog = await getBlogById(blogId);

    if (!existingBlog) {
      throw new ApiError(404, "Blog not found");
    }

    await deleteBlog(blogId);

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
