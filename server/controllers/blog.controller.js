const { SaveTags } = require("../services/tag.service");
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getAllBlogs,
  incrementBlogReadCount,
} = require("../services/blog.service");
const ApiError = require("../utils/api-error.util");

exports.createBlogPost = async (req, res, next) => {
  try {
    const authorId = req.user._id;
    const { title, description, body, tags } = req.validated.body;

    const tagObjectIds = await SaveTags(tags);

    const blogData = {
      title,
      description,
      body,
      tags: tagObjectIds,
      author: authorId,
      state: "draft",
      read_count: 0,
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

exports.getBlogPosts = async (req, res, next) => {
  try {
    const result = await getAllBlogs(req.validated.query);

    res.status(200).json({
      message: "Published blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBlogPost = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    const blogPost = await getBlogById(blogId);

    if (!blogPost || blogPost.state !== "published") {
      throw new ApiError(404, "Blog post not found or not published");
    }

    const updatedBlogPost = await incrementBlogReadCount(blogId);

    res.status(200).json({
      message: "Blog post fetched successfully",
      data: updatedBlogPost,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyBlogPosts = async (req, res, next) => {
  try {
    const authorId = req.user._id;
    const query = req.validated.query || {};
    query.authorId = authorId;

    const result = await getAllBlogs(query);

    res.status(200).json({
      message: "Your blogs fetched successfully",
      data: result.blogs || [],
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyBlogPost = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user._id;

    const blogPost = await getBlogById(blogId);

    if (!blogPost || blogPost.author._id.toString() !== authorId.toString()) {
      throw new ApiError(404, "Blog post not found");
    }

    res.status(200).json({
      message: "Your blog fetched successfully",
      data: blogPost,
    });
  } catch (error) {
    next(error);
  }
};

exports.publishBlogPost = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user._id;

    const existingBlog = await getBlogById(blogId);

    if (
      !existingBlog ||
      existingBlog.author._id.toString() !== authorId.toString()
    ) {
      throw new ApiError(404, "Blog not found");
    }

    if (existingBlog.state === "published") {
      throw new ApiError(400, "Blog is already published");
    }

    const updatedBlog = await updateBlog(blogId, { state: "published" });

    res.status(200).json({
      message: "Blog published successfully",
      data: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBlogPost = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user._id;

    const { title, description, body, state, tags } = req.validated.body;

    const existingBlog = await getBlogById(blogId);

    if (
      !existingBlog ||
      existingBlog.author._id.toString() !== authorId.toString()
    ) {
      throw new ApiError(404, "Blog not found");
    }

    let tagObjectIds = existingBlog.tags;
    if (tags !== undefined) {
      tagObjectIds = await SaveTags(tags);
    }

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (body !== undefined) updatePayload.body = body;
    if (state !== undefined) updatePayload.state = state;
    if (tagObjectIds !== existingBlog.tags) updatePayload.tags = tagObjectIds;
    updatePayload.updatedAt = new Date();

    const updatedBlog = await updateBlog(blogId, updatePayload);

    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlogPost = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user._id;

    const existingBlog = await getBlogById(blogId);

    if (
      !existingBlog ||
      existingBlog.author._id.toString() !== authorId.toString()
    ) {
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
