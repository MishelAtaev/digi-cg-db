import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Home from "./pages/HomePage/Home";
import NavBar from "./components/NavBar";
import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [backendUser, setBackendUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch('http://localhost:5000/auth/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setBackendUser(data);
          } else {
            console.error('Failed to fetch user from backend', response.status);
          }
        } catch (error) {
          console.error('Error fetching user from backend', error);
        }
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <NavBar />
      <div>
        {!isAuthenticated && <button onClick={() => loginWithRedirect()}>Log in</button>}
        {isAuthenticated && (
          <button onClick={() => logout({ returnTo: window.location.origin })}>Log out</button>
        )}
        {isAuthenticated && backendUser && <div>Welcome, {backendUser.username}</div>}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
