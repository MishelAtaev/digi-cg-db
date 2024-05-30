import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/HomePage/Home";
import NavBar from "./components/NavBar";
import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <Router>
      <NavBar />
      <div>
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect()}>Log in</button>
        )}

        {isAuthenticated && (
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log out
          </button>
        )}

        {isAuthenticated && (
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
