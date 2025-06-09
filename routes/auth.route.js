const express = require("express");
const passport = require("../config/passport.config");
const validate = require("../middlewares/validate.middleware");
const { authenticateJWT } = require("../middlewares/auth.token.middleware");
const authValidator = require("../utils/validator.utils");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", validate(authValidator.signup), authController.signup);
router.post("/login", validate(authValidator.login), authController.login);

// // Protected route example
// router.get("/profile", authenticateJWT, (req, res) => {
//   res.json({
//     success: true,
//     data: {
//       user: {
//         id: req.user._id,
//         email: req.user.email,
//         createdAt: req.user.createdAt,
//       },
//     },
//   });
// });

module.exports = router;
