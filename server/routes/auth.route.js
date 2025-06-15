const express = require("express");
const {
  validate,
  useValidatedData,
} = require("../middlewares/validate.middleware");
const { authValidation } = require("../utils/validator.util");
const authController = require("../controllers/auth.controller");
const {
  authenticateJWT,
} = require("../middlewares/authenticate-jwt.middleware");
const router = express.Router();

router.post(
  "/signup",
  validate(authValidation.signup),
  useValidatedData,
  authController.signup
);

router.post(
  "/login",
  validate(authValidation.login),
  useValidatedData,
  authController.login
);

router.post("/refresh-token", authenticateJWT, authController.refreshToken);

router.post("/logout", authenticateJWT, authController.logout);

router.get("/profile", authenticateJWT, authController.getProfile);

router.put(
  "/profile",
  authenticateJWT,
  validate(authValidation.updateProfile),
  useValidatedData,
  authController.updateProfile
);

router.delete("/profile", authenticateJWT, authController.deleteAccount);

module.exports = router;
