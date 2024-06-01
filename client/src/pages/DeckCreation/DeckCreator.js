import React, { useState, useEffect } from "react";
import CardSearch from "../../components/CardSearch";
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
          const response = await fetch(
            `http://localhost:5000/api/decks/${deckId}?userId=${userId}`
          );
          if (response.ok) {
            const data = await response.json();
            setDeck(data);
          } else {
            console.error("Error fetching deck:", response.statusText);
          }
        } catch (err) {
          console.error("Error fetching deck:", err);
        }
      } else {
        setDeck({ name: "", digiEggs: [], mainDeck: [] });
      }
    };

    fetchDeck();
  }, [deckId, userId]);

  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cards?sort=name&series=Digimon Card Game&sortdirection=asc`
        );
        if (response.ok) {
          const data = await response.json();
          setCards(data);
        } else {
          console.error("Error fetching cards:", response.statusText);
        }
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };

    fetchAllCards();
  }, []);

  const handleSearch = async (searchParams) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(
        `http://localhost:5000/api/cards?${queryString}`
      );
      if (response.ok) {
        const data = await response.json();
        setCards(data);
        setVisibleCards(20);
      } else {
        console.error("Error fetching cards:", response.statusText);
      }
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
      const response = await fetch("http://localhost:5000/api/deck/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const removeCardFromDeck = async (card) => {
    try {
      const response = await fetch("http://localhost:5000/api/deck/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const handleSaveDeck = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/decks/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
