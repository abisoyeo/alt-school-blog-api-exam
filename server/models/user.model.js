const mongoose = require("mongoose");
const userAuthPlugin = require("../plugins/user-auth.plugin");

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
    refresh_token: { type: String },
    bio: {
      type: String,
      maxLength: 250,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dob7udjfx/image/upload/v1750088803/Screenshot_2025-06-16_164528_mxt6ir.png",
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
