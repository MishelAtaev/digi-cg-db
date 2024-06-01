import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DecksOverview = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDecks = async () => {
      if (!userId) {
        console.error("No userId provided");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/decks?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setDecks(data);
        } else {
          console.error("Error fetching decks:", response.statusText);
        }
      } catch (err) {
        console.error("Error fetching decks:", err);
      }
    };

    fetchDecks();
  }, [userId]);

  const handleDeleteDeck = async (deckId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/decks/${deckId}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setDecks(decks.filter((deck) => deck._id !== deckId));
      } else {
        console.error("Error deleting deck:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting deck:", err);
    }
  };

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
