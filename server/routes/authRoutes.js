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
    console.log("Callback user:", req.user);
    res.redirect("http://localhost:3000"); // Adjust this URL to your frontend URL
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

router.get("/user", (req, res) => {
  console.log("Authenticated:", req.isAuthenticated());
  if (!req.isAuthenticated()) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  console.log("User:", req.user);
  res.json(req.user);
});

module.exports = router;
