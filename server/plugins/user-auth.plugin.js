const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userAuthPlugin = function (schema) {
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  schema.methods.generateAuthToken = function () {
    return jwt.sign(
      { user: { id: this._id, email: this.email } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  };

  schema.methods.generateRefreshToken = function () {
    return jwt.sign(
      { user: { id: this._id } },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
  };

  schema.methods.isValidPassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
  };
};

module.exports = userAuthPlugin;
