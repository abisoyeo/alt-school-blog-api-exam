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

// const blogValidation = {
//   create: Joi.object({
//     title: Joi.string().min(3).required().messages({
//       "string.min": "Title must be at least 3 characters long",
//       "any.required": "Title is required",
//     }),
//     content: Joi.string().min(10).required().messages({
//       "string.min": "Content must be at least 10 characters long",
//       "any.required": "Content is required",
//     }),
//   }),
// };

module.exports = authValidation;
