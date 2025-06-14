const passport = require("passport");
const ApiError = require("../utils/api-error.util");

exports.authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(
        new ApiError(
          401,
          info?.message || "Invalid or expired token. Please login again."
        )
      );
    }

    req.user = user;
    next();
  })(req, res, next);
};
