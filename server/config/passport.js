const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
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
      try {
        let user = await User.findOne({ auth0Id: profile.id });
        if (!user) {
          user = await User.create({
            auth0Id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    console.log("Deserializing user:", user);
    done(err, user);
  });
});
