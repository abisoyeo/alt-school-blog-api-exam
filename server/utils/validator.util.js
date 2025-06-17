const Joi = require("joi");

const authValidation = {
  signup: Joi.object({
    first_name: Joi.string().required().messages({
      "any.required": "First Name is required",
      "string.empty": "First Name cannot be empty",
    }),
    last_name: Joi.string().required().messages({
      "any.required": "Last Name is required",
      "string.empty": "Last Name cannot be empty",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
    bio: Joi.string().max(500).trim().optional().messages({
      "string.max": "Bio cannot exceed 500 characters",
    }),
    avatar: Joi.string().uri().optional().messages({
      "string.uri": "Avatar must be a valid URL",
    }),
    social_links: Joi.object({
      twitter: Joi.string().optional().allow(""),
      linkedin: Joi.string().optional().allow(""),
      github: Joi.string().optional().allow(""),
      website: Joi.string().uri().optional().allow(""),
    }).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
  }),

  updateProfile: Joi.object({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string().email().optional().messages({
      "string.email": "Please provide a valid email address",
    }),
    password: Joi.string().min(6).optional().messages({
      "string.min": "Password must be at least 6 characters long",
    }),
    bio: Joi.string().max(500).trim().optional().messages({
      "string.max": "Bio cannot exceed 500 characters",
    }),
    avatar: Joi.string().uri().optional().messages({
      "string.uri": "Avatar must be a valid URL",
    }),
    social_links: Joi.object({
      twitter: Joi.string().optional().allow(""),
      linkedin: Joi.string().optional().allow(""),
      github: Joi.string().optional().allow(""),
      website: Joi.string().uri().optional().allow(""),
    }).optional(),
  }),
};

const blogValidation = {
  createBlog: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required",
      "string.empty": "Title cannot be empty",
    }),
    description: Joi.string().optional(),
    body: Joi.string().required().messages({
      "any.required": "Body is required",
      "string.empty": "Body cannot be empty",
    }),
    state: Joi.string().valid("draft", "published").optional().default("draft"),
    tags: Joi.array()
      .items(Joi.string().trim().min(1))
      .max(10)
      .optional()
      .default([]),
  }),

  updateBlog: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    body: Joi.string().optional(),
    state: Joi.string().valid("draft", "published").optional(),
    tags: Joi.array()
      .items(Joi.string().trim().min(1))
      .max(10)
      .optional()
      .default([]),
  }),

  publicBlogs: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    title: Joi.string().trim().optional(),
    author: Joi.string().trim().optional(),
    tags: Joi.string().trim().optional(),
    sort_by: Joi.string()
      .valid("read_count", "reading_time", "createdAt", "updatedAt")
      .default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
  }),

  authorBlogs: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    state: Joi.string().valid("draft", "published").optional(),
  }),
};

module.exports = { authValidation, blogValidation };
