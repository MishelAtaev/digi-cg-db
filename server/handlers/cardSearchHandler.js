const axios = require("axios");
require("dotenv").config();

// Build query string dynamically
const buildQueryParams = (params) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      query.append(key, params[key]);
    }
  });
  return query.toString();
};

// Handler to fetch cards from the API
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
    let url;
    const query = buildQueryParams({
      n: name,
      desc,
      color,
      type,
      attribute,
      card,
      pack,
      sort,
      sortdirection,
      series,
    });

    if (query) {
      url = `${process.env.DIGIMON_API_URL}/search.php?${query}`;
    } else {
      const allCardsQuery = buildQueryParams({
        sort: "name",
        series: "Digimon Card Game",
        sortdirection: "asc",
      });
      url = `${process.env.DIGIMON_API_URL}/getAllCards.php?${allCardsQuery}`;
    }

    const response = await axios.get(url);
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
    res.json(cards);
  } catch (err) {
    console.error("Error fetching cards:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = { getCards };
