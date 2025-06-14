const ApiError = require("../utils/api-error.util");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(error);

  // Mongoose Errors
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } '${value}' already exists`;
    error = new ApiError(409, message);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
