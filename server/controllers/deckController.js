const Deck = require("../models/Deck");

exports.createDeck = async (req, res) => {
  try {
    const { name, cards, public } = req.body;
    const deck = new Deck({
      name,
      user: req.user.id,
      cards,
      public,
    });
    await deck.save();
    res.json(deck);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ public: true }).populate("user", [
      "username",
    ]);
    res.json(decks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUserDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user.id });
    res.json(decks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
