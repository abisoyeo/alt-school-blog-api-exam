const Joi = require("joi");

const authValidation = {
  // User registration validation
  signup: Joi.object({
    first_name: Joi.string().required().messages({
      "any.required": "First Name is required",
    }),
    last_name: Joi.string().required().messages({
      "any.required": "Last Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  }),

  // User login validation
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),
};

const blogValidation = {
  create: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required",
    }),
    description: Joi.string().optional(),
    body: Joi.string().required().messages({
      "any.required": "Body is required",
    }),
    state: Joi.string().valid("draft", "published").optional(),
  }),

  update: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    body: Joi.string().optional(),
    state: Joi.string().valid("draft", "published").optional(),
  }),

  listBlogs: Joi.object({
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
};

module.exports = { authValidation, blogValidation };
