const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/auth0",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  })
);

router.get(
  "/callback",
  passport.authenticate("auth0", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
