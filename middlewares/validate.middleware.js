const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    next();
  };
};

module.exports = validate;
