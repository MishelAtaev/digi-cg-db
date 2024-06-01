import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Helper function for API calls
const fetchDecks = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/decks?userId=${userId}`
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error fetching decks:", response.statusText);
    }
  } catch (err) {
    console.error("Error fetching decks:", err);
  }
};

const DecksOverview = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadDecks = async () => {
      if (!userId) {
        console.error("No userId provided");
        return;
      }
      const data = await fetchDecks(userId);
      if (data) setDecks(data);
    };

    loadDecks();
  }, [userId]);

  // Delete a deck
  const handleDeleteDeck = async (deckId) => {
    try {
      const response = await fetch(`http://localhost:5000/decks/${deckId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDecks(decks.filter((deck) => deck._id !== deckId));
      } else {
        console.error("Error deleting deck:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting deck:", err);
    }
  };

  // Navigate to create a new deck
  const handleCreateNewDeck = () => {
    navigate("/deck/new");
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
