require("dotenv").config();
const express = require("express");
const passport = require("./config/passport.config");
const authRoutes = require("./routes/auth.route");
const blogRoutes = require("./routes/blog.route");
const {
  authenticateJWT,
} = require("./middlewares/authenticate-jwt.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
