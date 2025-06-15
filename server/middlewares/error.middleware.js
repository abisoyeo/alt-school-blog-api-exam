const ApiError = require("../utils/api-error.util");
const multer = require("multer");

const errorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      error = new ApiError(400, "File too large. Max size is 5MB.");
    } else {
      error = new ApiError(400, error.message);
    }
  }

  if (error.message === "Only image files are allowed!") {
    error = new ApiError(400, error.message);
  }

  if (!error.isOperational) {
    console.error("==> API ERROR:");
    console.error("Status:", error.statusCode || 500);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Request URL:", req.originalUrl);
  }

  if (error.originalError && error.originalError.stack !== error.stack) {
    console.error("Original Error:", error.originalError);
  }

  // Mongoose Errors
  if (error.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } '${value}' already exists`;
    error = new ApiError(409, message);
  }

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((val) => val.message);
    error = new ApiError(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
