require("dotenv").config();

exports.getCards = async (req, res) => {
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
    const fetch = (await import("node-fetch")).default;
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
      response = await fetch(url);
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
      response = await fetch(url);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Network response was not ok: ${response.statusText}, ${errorText}`
      );
    }

    const cards = await response.json();
    console.log("Fetched cards:", cards);
    res.json(cards);
  } catch (err) {
    console.error("Error fetching cards:", err);
    res.status(500).send("Server Error");
  }
};
