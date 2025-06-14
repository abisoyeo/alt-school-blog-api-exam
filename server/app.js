require("dotenv").config();
const express = require("express");
const passport = require("./config/passport.config");
const authRoutes = require("./routes/auth.route");
const blogRoutes = require("./routes/blog.route");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.use(errorHandler);

module.exports = app;
