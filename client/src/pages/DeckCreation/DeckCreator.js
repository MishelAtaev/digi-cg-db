import React, { useState, useEffect } from "react";
import CardSearch from "../../components/CardSearch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
        try {
          const response = await axios.get(
            `http://localhost:5000/api/decks/${deckId}`,
            {
              params: { userId },
            }
          );
          setDeck(response.data);
        } catch (err) {
          console.error("Error fetching deck:", err);
        }
      } else {
        // Reset the deck state for creating a new deck
        setDeck({ name: "", digiEggs: [], mainDeck: [] });
      }
    };

    fetchDeck();
  }, [deckId, userId]);

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

  const handleShowMore = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 20);
  };

  const addCardToDeck = async (card) => {
    const cardData = {
      cardnumber: card.cardnumber,
      type: card.type,
      name: card.name,
      image_url: card.image_url,
    };
    try {
      const response = await axios.post("http://localhost:5000/api/deck/add", {
        card: cardData,
        userId,
      });
      setDeck(response.data);
    } catch (err) {
      console.error("Error adding card to deck:", err);
    }
  };

  const removeCardFromDeck = async (card) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/deck/remove",
        { card, userId }
      );
      setDeck(response.data);
    } catch (err) {
      console.error("Error removing card from deck:", err);
    }
  };

  const handleSaveDeck = async () => {
    try {
      await axios.post("http://localhost:5000/api/decks/save", {
        deck,
        userId,
      });
      navigate("/decks");
    } catch (err) {
      console.error("Error saving deck:", err);
    }
  };

  return (
    <div>
      <h1>{deckId ? "Update Deck" : "Create New Deck"}</h1>
      <input
        type="text"
        value={deck.name}
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
                <p>{card.name}</p>
                <button onClick={() => addCardToDeck(card)}>+</button>
                <button onClick={() => removeCardFromDeck(card)}>-</button>
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
      <h2>Your Deck</h2>
      <h3>Digi-Egg Cards ({deck.digiEggs.length}/5)</h3>
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
            <button onClick={() => removeCardFromDeck(card)}>-</button>
          </div>
        ))}
      </div>
      <h3>Main Deck Cards ({deck.mainDeck.length}/50)</h3>
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
            <p>Count: {card.count}</p>
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
