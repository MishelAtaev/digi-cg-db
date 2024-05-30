const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./config/passport"); // Passport config

const app = express();
connectDB();

// Middleware
app.use(morgan("dev"));
app.use(express.json({ extended: false }));
app.use(cors());

// Express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using https
      maxAge: 60000, // Session expiration time in milliseconds
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/decks", require("./routes/deckRoutes"));
app.use("/api/cards", require("./routes/cardRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
