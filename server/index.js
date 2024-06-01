const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { signupHandler, loginHandler } = require("./handlers/userHandler");
const { getCards } = require("./handlers/cardSearchHandler");
const {
  addCardToDeck,
  removeCardFromDeck,
  getDeck,
  getDecks,
  deleteDeck,
  saveDeck,
} = require("./handlers/deckHandler");
const { connectToDb } = require("./db");
require("dotenv").config();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Connect to MongoDB
connectToDb().then(() => {
  // Start the server only after the DB connection is established
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

// Routes
app.post("/signup", signupHandler);
app.post("/login", loginHandler);
app.get("/api/cards", getCards);
app.post("/api/deck/add", addCardToDeck);
app.post("/api/deck/remove", removeCardFromDeck);
app.get("/api/deck", getDeck);
app.get("/api/decks", getDecks);
app.delete("/api/decks/:deckId", deleteDeck);
app.post("/api/decks/save", saveDeck);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Something broke!");
});
