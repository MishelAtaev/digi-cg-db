import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/HomePage/Home";
import CardDatabase from "./pages/CardDatabase/CardDatabase";
import DeckOverview from "./pages/DeckCreation/DeckOverview";
import DeckCreator from "./pages/DeckCreation/DeckCreator";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <NavBar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/signup"
          element={<Signup setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/carddatabase" element={<CardDatabase />} />
        <Route path="/decks" element={<DeckOverview />} />
        <Route path="/deck/new" element={<DeckCreator />} />
        <Route path="/deck/:deckId" element={<DeckCreator />} />
      </Routes>
    </Router>
  );
};

export default App;
