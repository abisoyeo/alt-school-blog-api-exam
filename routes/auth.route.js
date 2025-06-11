const express = require("express");
const {
  validate,
  useValidatedData,
} = require("../middlewares/validate.middleware");
const { authValidation } = require("../utils/validator.util");
const authController = require("../controllers/auth.controller");
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

module.exports = router;
