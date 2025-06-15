const passport = require("passport");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error.util");

exports.signup = async (req, res, next) => {
  passport.authenticate(
    "signup",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err);
      }

      const token = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      user.refresh_token = refreshToken;
      await user.save();

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
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
    }
  )(req, res, next);
};

exports.login = async (req, res, next) => {
  passport.authenticate(
    "login",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err);
      }

      const token = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      user.refresh_token = refreshToken;
      await user.save();

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
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
    }
  )(req, res, next);
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.user.id);

    if (user) {
      user.refresh_token = null;
      await user.save();
    }

    res
      .clearCookie("refreshToken")
      .json({ success: true, message: "Logged out" });
  } catch (err) {
    res.clearCookie("refreshToken");
    return next(
      new ApiError(403, "Failed to log out. Please try again later.", err)
    );
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return next(
        new ApiError(401, "No refresh token provided. Please log in again.")
      );

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user || user.refresh_token !== token) {
      return next(
        new ApiError(
          403,
          "Invalid or expired refresh token. Please log in again."
        )
      );
    }

    const newAccessToken = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refresh_token = newRefreshToken;
    await user.save();

    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          user: {
            id: user._id,
            email: user.email,
          },
          token: newAccessToken,
        },
      });
  } catch (err) {
    return next(
      new ApiError(403, "Failed to refresh token. Please log in again.", err)
    );
  }
};

exports.getProfile = (req, res) => {
  res.json({
    success: true,
    message: "User profile retrieved successfully",
    data: {
      user: req.user,
    },
  });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await req.user.set(req.body).save();
    console.log("Updated User:", updatedUser);
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          social_links: updatedUser.social_links,
        },
      },
    });
  } catch (err) {
    next(new ApiError(500, "Failed to update profile", err));
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await req.user.remove();
    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    next(new ApiError(500, "Failed to delete account", err));
  }
};
