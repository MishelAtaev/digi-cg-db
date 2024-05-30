const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
      const newUser = {
        auth0Id: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
      };

      try {
        let user = await User.findOne({ auth0Id: profile.id });

        if (user) {
          return done(null, user);
        } else {
          user = await User.create(newUser);
          return done(null, user);
        }
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
