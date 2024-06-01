import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DecksOverview = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Retrieve userId from local storage

  useEffect(() => {
    const fetchDecks = async () => {
      if (!userId) {
        console.error("No userId provided");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/decks", {
          params: { userId },
        });
        setDecks(response.data);
      } catch (err) {
        console.error("Error fetching decks:", err);
      }
    };

    fetchDecks();
  }, [userId]);

  const handleDeleteDeck = async (deckId) => {
    try {
      await axios.delete(`http://localhost:5000/api/decks/${deckId}`, {
        params: { userId },
      });
      setDecks(decks.filter((deck) => deck._id !== deckId));
    } catch (err) {
      console.error("Error deleting deck:", err);
    }
  };

  const handleCreateNewDeck = () => {
    navigate("/deck/new"); // Navigate without any state
  };

  return (
    <div>
      <h1>Your Decks</h1>
      <button onClick={handleCreateNewDeck}>Create New Deck</button>
      {decks.length > 0 ? (
        <div>
          {decks.map((deck) => (
            <div key={deck._id}>
              <h2>{deck.name}</h2>
              <button
                onClick={() =>
                  navigate(`/deck/${deck._id}`, { state: { userId } })
                }
              >
                Edit
              </button>
              <button onClick={() => handleDeleteDeck(deck._id)}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No decks found</p>
      )}
    </div>
  );
};

export default DecksOverview;
