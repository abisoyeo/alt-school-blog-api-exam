exports.signup = async (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: info.message || "Registration failed",
      });
    }

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
        token,
      },
    });
  })(req, res, next);
};

exports.login = async (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || "Login failed",
      });
    }

    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
        token,
      },
    });
  })(req, res, next);
};
