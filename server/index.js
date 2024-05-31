const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { signupHandler, loginHandler } = require("./handlers/userHandler");
require("dotenv").config();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.post("/signup", signupHandler);
app.post("/login", loginHandler);
// app.use("/api/decks", require("./routes/deckRoutes"));
// app.use("/api/cards", require("./routes/cardRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
