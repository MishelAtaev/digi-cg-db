const mongoose = require("mongoose");

const deckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  digiEggs: {
    type: Array,
    default: [],
  },
  mainDeck: {
    type: Array,
    default: [],
  },
});

const Deck = mongoose.model("Deck", deckSchema);

module.exports = Deck;
