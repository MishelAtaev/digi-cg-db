import React, { useState, useEffect } from "react";
import CardSearch from "../../components/CardSearch";
import axios from "axios";

const CardDatabase = () => {
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(20);

  // Fetch all cards when the component mounts
  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cards", {
          params: {
            sort: "name",
            series: "Digimon Card Game",
            sortdirection: "asc",
          },
        });
        setCards(response.data);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };

    fetchAllCards();
  }, []);

  const handleShowMore = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 20);
  };

  const handleSearch = async (searchParams) => {
    try {
      const response = await axios.get("http://localhost:5000/api/cards", {
        params: searchParams,
      });
      setCards(response.data);
      setVisibleCards(20);
    } catch (err) {
      console.error("Error fetching cards:", err);
    }
  };

  return (
    <div>
      <h1>Card Database</h1>
      <CardSearch onSearch={handleSearch} />
      <div>
        {cards.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {cards.slice(0, visibleCards).map((card) => (
              <div
                key={card.cardnumber}
                style={{ margin: "10px", textAlign: "center" }}
              >
                <img
                  src={card.image_url}
                  alt={card.name}
                  style={{ width: "200px", height: "auto" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No cards found</p>
        )}
      </div>
      {visibleCards < cards.length && (
        <button onClick={handleShowMore}>Show More</button>
      )}
    </div>
  );
};

export default CardDatabase;
