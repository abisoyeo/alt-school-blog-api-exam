const mongoose = require("mongoose");
const blogPostPlugin = require("../plugins/blog.plugin");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ author: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ read_count: -1 });
blogSchema.index({ reading_time: 1 });
blogSchema.index({ createdAt: -1 });

blogSchema.plugin(blogPostPlugin);

module.exports = mongoose.model("Blog", blogSchema);
