const passport = require("passport");

exports.authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please Login again.",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};
