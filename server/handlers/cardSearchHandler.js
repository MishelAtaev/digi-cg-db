const axios = require("axios");
require("dotenv").config();

const getCards = async (req, res) => {
  const {
    name,
    desc,
    color,
    type,
    attribute,
    card,
    pack,
    sort,
    sortdirection,
    series,
  } = req.query;

  try {
    let response;
    let url;

    // Build query string dynamically
    const query = new URLSearchParams();
    if (name) query.append("n", name);
    if (desc) query.append("desc", desc);
    if (color) query.append("color", color);
    if (type) query.append("type", type);
    if (attribute) query.append("attribute", attribute);
    if (card) query.append("card", card);
    if (pack) query.append("pack", pack);
    if (sort) query.append("sort", sort);
    if (sortdirection) query.append("sortdirection", sortdirection);
    if (series) query.append("series", series);

    if (query.toString()) {
      // Fetch specific cards based on query parameters
      url = `${process.env.DIGIMON_API_URL}/search.php?${query.toString()}`;
      console.log("Fetching specific cards from Digimon API with URL:", url);
      response = await axios.get(url);
    } else {
      // Fetch all cards
      const allCardsQuery = new URLSearchParams({
        sort: "name",
        series: "Digimon Card Game",
        sortdirection: "asc",
      });

      url = `${
        process.env.DIGIMON_API_URL
      }/getAllCards.php?${allCardsQuery.toString()}`;
      console.log("Fetching all cards from Digimon API with URL:", url);
      response = await axios.get(url);
    }

    const cards = response.data.map((card) => ({
      name: card.name,
      type: card.type,
      color: card.color,
      stage: card.stage,
      digi_type: card.digi_type,
      attribute: card.attribute,
      level: card.level,
      play_cost: card.play_cost,
      evolution_cost: card.evolution_cost,
      cardrarity: card.cardrarity,
      artist: card.artist,
      dp: card.dp,
      cardnumber: card.cardnumber,
      maineffect: card.maineffect,
      soureeffect: card.soureeffect,
      set_name: card.set_name,
      card_sets: card.card_sets,
      image_url: card.image_url,
    }));
    console.log("Fetched cards:", cards);
    res.json(cards);
  } catch (err) {
    console.error("Error fetching cards:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getCards,
};
