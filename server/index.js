const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./config/passport");

const app = express();
connectDB();

app.use(morgan("dev"));
app.use(express.json({ extended: false }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: "None",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`Session: ${JSON.stringify(req.session)}`);
  console.log(`User: ${JSON.stringify(req.user)}`);
  next();
});

app.use("/auth", require("./routes/authRoutes"));
app.use("/api/decks", require("./routes/deckRoutes"));
app.use("/api/cards", require("./routes/cardRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
