class ApiError extends Error {
  constructor(statusCode, message, originalError = null, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.originalError = originalError;
  }
}

module.exports = ApiError;
