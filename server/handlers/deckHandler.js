const { ObjectId } = require("mongodb");
const { getDb } = require("../db");

const isValidUuid = (id) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    id
  );

const addCardToDeck = async (req, res) => {
  const { card, userId } = req.body;

  console.log("addCardToDeck request body:", req.body);

  if (!isValidUuid(userId)) {
    console.error("Invalid userId:", userId);
    return res.status(400).send("Invalid userId");
  }

  if (!card || !card.cardnumber || !card.type) {
    console.error("Invalid card data:", card);
    return res.status(400).send("Invalid card data");
  }

  try {
    const db = getDb();
    let deck = await db.collection("decks").findOne({ userId });

    if (!deck) {
      deck = {
        userId,
        digiEggs: [],
        mainDeck: [],
      };
    }

    if (card.type === "Digi-Egg") {
      if (deck.digiEggs.length < 5) {
        deck.digiEggs.push(card);
      } else {
        return res
          .status(400)
          .send("You can only have up to 5 Digi-Egg cards in your deck.");
      }
    } else {
      const existingCard = deck.mainDeck.find(
        (c) => c.cardnumber === card.cardnumber
      );
      const cardCount = existingCard ? existingCard.count : 0;

      if (deck.mainDeck.length < 50 && cardCount < 4) {
        if (existingCard) {
          existingCard.count += 1;
        } else {
          card.count = 1;
          deck.mainDeck.push(card);
        }
      } else if (cardCount >= 4) {
        return res
          .status(400)
          .send(
            "You can only have up to 4 copies of the same card in your deck."
          );
      } else {
        return res
          .status(400)
          .send("You can only have up to 50 cards in your main deck.");
      }
    }

    await db
      .collection("decks")
      .updateOne({ userId }, { $set: deck }, { upsert: true });
    res.status(200).send(deck);
  } catch (e) {
    console.error("Error in addCardToDeck:", e);
    res.status(500).send(e);
  }
};

const removeCardFromDeck = async (req, res) => {
  const { card, userId } = req.body;

  console.log("removeCardFromDeck request body:", req.body);

  if (!isValidUuid(userId)) {
    console.error("Invalid userId:", userId);
    return res.status(400).send("Invalid userId");
  }

  if (!card || !card.cardnumber || !card.type) {
    console.error("Invalid card data:", card);
    return res.status(400).send("Invalid card data");
  }

  try {
    const db = getDb();
    let deck = await db.collection("decks").findOne({ userId });

    if (!deck) {
      return res.status(404).send("Deck not found.");
    }

    if (card.type === "Digi-Egg") {
      deck.digiEggs = deck.digiEggs.filter(
        (c) => c.cardnumber !== card.cardnumber
      );
    } else {
      const existingCard = deck.mainDeck.find(
        (c) => c.cardnumber === card.cardnumber
      );
      if (existingCard) {
        if (existingCard.count > 1) {
          existingCard.count -= 1;
        } else {
          deck.mainDeck = deck.mainDeck.filter(
            (c) => c.cardnumber !== card.cardnumber
          );
        }
      }
    }

    await db
      .collection("decks")
      .updateOne({ userId }, { $set: deck }, { upsert: true });
    res.status(200).send(deck);
  } catch (e) {
    console.error("Error in removeCardFromDeck:", e);
    res.status(500).send(e);
  }
};

const getDeck = async (req, res) => {
  const { userId, deckId } = req.query;

  console.log("getDeck request query:", req.query);

  if (!isValidUuid(userId) || !ObjectId.isValid(deckId)) {
    console.error("Invalid userId or deckId:", userId, deckId);
    return res.status(400).send("Invalid userId or deckId");
  }

  try {
    const db = getDb();
    const deck = await db.collection("decks").findOne({
      userId,
      _id: ObjectId(deckId),
    });
    if (!deck) {
      return res.status(404).send("Deck not found.");
    }
    res.status(200).send(deck);
  } catch (e) {
    console.error("Error in getDeck:", e);
    res.status(500).send(e);
  }
};

const getDecks = async (req, res) => {
  const { userId } = req.query;

  console.log("getDecks request query:", req.query);

  if (!isValidUuid(userId)) {
    console.error("Invalid userId:", userId);
    return res.status(400).send("Invalid userId");
  }

  try {
    const db = getDb();
    const decks = await db.collection("decks").find({ userId }).toArray();
    res.status(200).send(decks);
  } catch (e) {
    console.error("Error in getDecks:", e);
    res.status(500).send(e);
  }
};

const deleteDeck = async (req, res) => {
  const { deckId, userId } = req.query;

  console.log("deleteDeck request query:", req.query);

  if (!ObjectId.isValid(deckId) || !isValidUuid(userId)) {
    console.error("Invalid deckId or userId:", deckId, userId);
    return res.status(400).send("Invalid deckId or userId");
  }

  try {
    const db = getDb();
    await db.collection("decks").deleteOne({
      _id: ObjectId(deckId),
      userId,
    });
    res.status(200).send({ message: "Deck deleted" });
  } catch (e) {
    console.error("Error in deleteDeck:", e);
    res.status(500).send(e);
  }
};

const saveDeck = async (req, res) => {
  const { deck, userId } = req.body;

  console.log("saveDeck request body:", req.body);

  if (!isValidUuid(userId)) {
    console.error("Invalid userId:", userId);
    return res.status(400).send("Invalid userId");
  }

  try {
    const db = getDb();

    if (deck._id) {
      if (!ObjectId.isValid(deck._id)) {
        console.error("Invalid deckId:", deck._id);
        return res.status(400).send("Invalid deckId");
      }
      const { _id, ...updateFields } = deck;
      await db.collection("decks").updateOne(
        {
          _id: new ObjectId(deck._id),
          userId,
        },
        { $set: updateFields }
      );
    } else {
      deck.userId = userId;
      const result = await db.collection("decks").insertOne(deck);
      deck._id = result.insertedId;
    }

    res.status(200).send(deck);
  } catch (e) {
    console.error("Error in saveDeck:", e);
    res.status(500).send(e);
  }
};

module.exports = {
  addCardToDeck,
  removeCardFromDeck,
  getDeck,
  getDecks,
  deleteDeck,
  saveDeck,
};
