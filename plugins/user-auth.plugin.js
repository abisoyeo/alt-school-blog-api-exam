const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userAuthPlugin = function (schema) {
  // Hash password before saving
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  // Generate JWT token (1 hour expiry)
  schema.methods.generateAuthToken = function () {
    return jwt.sign(
      { user: { id: this._id, email: this.email } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  };

  // Compare passwords
  schema.methods.isValidPassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
  };
};

module.exports = userAuthPlugin;
