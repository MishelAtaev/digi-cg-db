import { useState, useEffect } from "react";
import CardSearch from "../../components/CardSearch";
import { useNavigate, useParams } from "react-router-dom";

// Helper function for API calls
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

const DeckCreator = () => {
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(20);
  const [deck, setDeck] = useState({ name: "", digiEggs: [], mainDeck: [] });
  const { deckId } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeck = async () => {
      if (deckId) {
        const data = await fetchCards(
          `http://localhost:5000/api/decks/${deckId}?userId=${userId}`
        );
        if (data) setDeck(data);
      }
    };

    fetchDeck();
  }, [deckId, userId]);

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

  // Add card to deck
  const addCardToDeck = async (card) => {
    const cardData = {
      cardnumber: card.cardnumber,
      type: card.type,
      name: card.name,
      image_url: card.image_url,
    };
    try {
      const response = await fetch("http://localhost:5000/api/deck/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card: cardData, userId }),
      });
      if (response.ok) {
        const data = await response.json();
        setDeck(data);
      } else {
        console.error("Error adding card to deck:", response.statusText);
      }
    } catch (err) {
      console.error("Error adding card to deck:", err);
    }
  };

  // Remove card from deck
  const removeCardFromDeck = async (card) => {
    try {
      const response = await fetch("http://localhost:5000/api/deck/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card, userId }),
      });
      if (response.ok) {
        const data = await response.json();
        setDeck(data);
      } else {
        console.error("Error removing card from deck:", response.statusText);
      }
    } catch (err) {
      console.error("Error removing card from deck:", err);
    }
  };

  // Save deck
  const handleSaveDeck = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/decks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deck, userId }),
      });
      if (response.ok) {
        navigate("/decks");
      } else {
        console.error("Error saving deck:", response.statusText);
      }
    } catch (err) {
      console.error("Error saving deck:", err);
    }
  };

  // Calculate total cards in main deck
  const calculateTotalMainDeckCount = () => {
    return deck.mainDeck.reduce((total, card) => total + card.count, 0);
  };

  // Calculate total Digi-Egg cards
  const calculateTotalDigiEggCount = () => {
    return deck.digiEggs.reduce((total, card) => total + card.count, 0);
  };

  // Get card count in the deck
  const getCardCountInDeck = (card) => {
    const mainDeckCard = deck.mainDeck.find(
      (c) => c.cardnumber === card.cardnumber
    );
    const digiEggCard = deck.digiEggs.find(
      (c) => c.cardnumber === card.cardnumber
    );
    return (mainDeckCard?.count || 0) + (digiEggCard?.count || 0);
  };

  return (
    <div>
      <h1>{deckId ? "Update Deck" : "Create New Deck"}</h1>
      <input
        type="text"
        value={deck.name || ""}
        onChange={(e) => setDeck({ ...deck, name: e.target.value })}
        placeholder="Deck Name"
      />
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
                <button onClick={() => addCardToDeck(card)}>+</button>
                <span>{getCardCountInDeck(card)}</span>
                <button onClick={() => removeCardFromDeck(card)}>-</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No cards found</p>
        )}
      </div>
      {visibleCards < cards.length && (
        <button onClick={() => setVisibleCards((prev) => prev + 20)}>
          Show More
        </button>
      )}
      <h2>Your Deck</h2>
      <h3>Digi-Egg Cards ({calculateTotalDigiEggCount()}/5)</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {deck.digiEggs.map((card) => (
          <div
            key={card.cardnumber}
            style={{ margin: "10px", textAlign: "center" }}
          >
            <img
              src={card.image_url}
              alt={card.name}
              style={{ width: "200px", height: "auto" }}
            />
            <p>{card.name}</p>
            <p>{card.count}</p>
            <button onClick={() => addCardToDeck(card)}>+</button>
            <button onClick={() => removeCardFromDeck(card)}>-</button>
          </div>
        ))}
      </div>
      <h3>Main Deck Cards ({calculateTotalMainDeckCount()}/50)</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {deck.mainDeck.map((card) => (
          <div
            key={card.cardnumber}
            style={{ margin: "10px", textAlign: "center" }}
          >
            <img
              src={card.image_url}
              alt={card.name}
              style={{ width: "200px", height: "auto" }}
            />
            <p>{card.name}</p>
            <p>{card.count}</p>
            <button onClick={() => addCardToDeck(card)}>+</button>
            <button onClick={() => removeCardFromDeck(card)}>-</button>
          </div>
        ))}
      </div>
      <button onClick={handleSaveDeck}>Save Deck</button>
    </div>
  );
};

export default DeckCreator;
