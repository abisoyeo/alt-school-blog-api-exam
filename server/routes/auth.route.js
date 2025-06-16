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

router.use(authenticateJWT);

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logout);

router.get("/profile", authController.getProfile);

router.put(
  "/profile",
  validate(authValidation.updateProfile),
  useValidatedData,
  authController.updateProfile
);

router.delete("/profile", authController.deleteAccount);

module.exports = router;
