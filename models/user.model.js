const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userAuthPlugin = require("../plugins/user.auth.plugin");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxLength: 250,
      default: "",
    },
    avatar: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    social_links: {
      twitter: String,
      linkedin: String,
      github: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(userAuthPlugin);

module.exports = mongoose.model("User", userSchema);
