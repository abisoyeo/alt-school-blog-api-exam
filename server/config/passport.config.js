const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user.model");
const ApiError = require("../utils/api-error.util");

const opts = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.user.id).select(
        "-password -refresh_token"
      );
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw new ApiError(409, "Email already registered");
        }

        const { first_name, last_name, bio, avatar, social_links } = req.body;

        const user = await User.create({
          first_name,
          last_name,
          email,
          password,
          bio,
          avatar,
          social_links,
        });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new ApiError(401, "Invalid email or password");
        }

        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
          throw new ApiError(401, "Invalid email or password");
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;
