const express = require("express");
const passport = require("../config/passport.config");
const validate = require("../middlewares/validate.middleware");
const authValidator = require("../utils/validator.util");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", validate(authValidator.signup), authController.signup);
router.post("/login", validate(authValidator.login), authController.login);

module.exports = router;
