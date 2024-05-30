const express = require("express");
const {
  createDeck,
  getDecks,
  getUserDecks,
} = require("../controllers/deckController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, createDeck);
router.get("/", getDecks);
router.get("/my-decks", auth, getUserDecks);

module.exports = router;
