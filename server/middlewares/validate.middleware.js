const ApiError = require("../utils/api-error.util");

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(new ApiError(400, errorMessage));
    }

    req.validated = req.validated || {};
    req.validated[source] = value;
    next();
  };
};

const useValidatedData = (req, res, next) => {
  if (req.validated?.body) {
    req.body = req.validated.body;
  }
  next();
};
module.exports = {
  validate,
  useValidatedData,
};
