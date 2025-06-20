const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const Tag = require("../models/tag.model");

exports.createBlog = async (blogData) => {
  const blog = new Blog(blogData);
  await blog.save();
  return blog;
};

exports.getAllBlogs = async (query) => {
  const { page, limit, title, author, authorId, tags, state, sort_by, order } =
    query;

  const filter = {};
  const sort = {};
  const skip = (page - 1) * limit;

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

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

  if (authorId) {
    filter.author = authorId;
    if (state) {
      filter.state = state;
    }
  } else {
    filter.state = "published";
  }

  if (tags) {
    const tagNames = tags.split(",").map((tag) => tag.trim().toLowerCase());
    const tagDocs = await Tag.find({ name: { $in: tagNames } }, "_id");

    if (tagDocs.length > 0) {
      filter.tags = { $in: tagDocs.map((tag) => tag._id) };
    } else {
      filter.tags = null;
    }
  }

  const sortOrder = order === "asc" ? 1 : -1;
  sort[sort_by] = sortOrder;

  const blogs = await Blog.find(filter).sort(sort).skip(skip).limit(limit);

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

exports.getBlogById = async (blogId) => {
  return await Blog.findById(blogId);
};

exports.updateBlog = async (blogId, updateData) => {
  return await Blog.findByIdAndUpdate(blogId, updateData, {
    new: true,
  });
};

exports.deleteBlog = async (blogId) => {
  return await Blog.findByIdAndDelete(blogId);
};

exports.incrementBlogReadCount = async (blogId) => {
  return await Blog.findByIdAndUpdate(
    blogId,
    { $inc: { read_count: 1 } },
    { new: true }
  );
};
