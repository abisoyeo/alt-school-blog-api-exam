require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport.config");
const authRoutes = require("./routes/auth.route");
const blogRoutes = require("./routes/blog.route");
const ApiError = require("./utils/api-error.util");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

const indexPath = path.join(__dirname, "../client/dist/index.html");
console.log("Looking for frontend at:", indexPath);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Serve static frontend build
const distPath = path.resolve(__dirname, "/client/dist");

app.use(express.static(distPath));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`));
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.resolve(distPath, "index.html"));
});

app.use(errorHandler);

module.exports = app;
