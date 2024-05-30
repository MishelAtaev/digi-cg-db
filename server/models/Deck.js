const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cards: [{ type: String, required: true }],
  public: { type: Boolean, default: false },
});

module.exports = mongoose.model("Deck", DeckSchema);
