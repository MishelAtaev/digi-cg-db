import { useState, useEffect } from "react";
import CardSearch from "../../components/CardSearch";

// Fetch cards from the API
const fetchCards = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error fetching cards:", response.statusText);
    }
  } catch (err) {
    console.error("Error fetching cards:", err);
  }
};

const CardDatabase = () => {
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(20);

  // Fetch all cards from API
  useEffect(() => {
    const fetchAllCards = async () => {
      const data = await fetchCards(
        `http://localhost:5000/api/cards?sort=name&series=Digimon Card Game&sortdirection=asc`
      );
      if (data) setCards(data);
    };

    fetchAllCards();
  }, []);

  // Handle search functionality
  const handleSearch = async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    const data = await fetchCards(
      `http://localhost:5000/api/cards?${queryString}`
    );
    if (data) {
      setCards(data);
      setVisibleCards(20);
    }
  };

  // Show more cards
  const handleShowMore = () => {
    setVisibleCards((prev) => prev + 20);
  };

  return (
    <div className="container">
      <h1>Card Database</h1>
      <CardSearch onSearch={handleSearch} />
      <div className="card-container">
        {cards.length > 0 ? (
          cards.slice(0, visibleCards).map((card) => (
            <div className="card" key={card.cardnumber}>
              <img src={card.image_url} alt={card.name} />
            </div>
          ))
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
