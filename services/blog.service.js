const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const Tag = require("../models/tag.model");

// Create a new blog
exports.createBlog = async (blogData) => {
  const blog = new Blog(blogData);
  await blog.save();
  return blog;
};

// Get all blogs
exports.getAllBlogs = async (query) => {
  const { page, limit, title, author, authorId, tags, state, sort_by, order } =
    query;

  // Initialize filter and sort objects
  const filter = {};
  const sort = {};
  const skip = (page - 1) * limit;

  // Search by title
  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  // Filter by author name
  if (author) {
    const users = await User.find(
      {
        $or: [
          { first_name: { $regex: author, $options: "i" } },
          { last_name: { $regex: author, $options: "i" } },
        ],
      },
      "_id"
    );

    if (users.length > 0) {
      filter.author = { $in: users.map((user) => user._id) };
    } else {
      filter.author = null;
    }
  }

  // Filter by author ID
  if (authorId) {
    filter.author = authorId;
    if (state) {
      filter.state = state;
    }
  } else {
    // Default to published state for public blogs
    filter.state = "published";
  }

  // Filter by tags
  if (tags) {
    const tagNames = tags.split(",").map((tag) => tag.trim().toLowerCase());
    const tagDocs = await Tag.find({ name: { $in: tagNames } }, "_id");

    if (tagDocs.length > 0) {
      filter.tags = { $in: tagDocs.map((tag) => tag._id) };
    } else {
      filter.tags = null;
    }
  }

  // Sorting
  const sortOrder = order === "asc" ? 1 : -1;
  sort[sort_by] = sortOrder;

  const blogs = await Blog.find(filter).sort(sort).skip(skip).limit(limit);

  // Total count for pagination
  const totalBlogs = await Blog.countDocuments(filter);
  const totalPages = Math.ceil(totalBlogs / limit);

  return {
    blogs,
    pagination: {
      totalItems: totalBlogs,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: totalPages,
    },
  };
};

// Get blog by ID
exports.getBlogById = async (blogId) => {
  return await Blog.findById(blogId);
};

// Update blog
exports.updateBlog = async (blogId, updateData) => {
  return await Blog.findByIdAndUpdate(blogId, updateData, {
    new: true,
  });
};

// Delete blog
exports.deleteBlog = async (blogId) => {
  return await Blog.findByIdAndDelete(blogId);
};

// Increment blog read count
exports.incrementBlogReadCount = async (blogId) => {
  return await Blog.findByIdAndUpdate(
    blogId,
    { $inc: { read_count: 1 } },
    { new: true }
  );
};
