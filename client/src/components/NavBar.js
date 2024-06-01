import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../images/DIGICARDNEXUS.png";

const NavBar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  // Handle logout process
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="nav">
      <Link to="/">
        <img className="nav-logo" src={logo} alt="Logo" />
      </Link>
      <div className="nav-links">
        <Link className="nav-link" to="/carddatabase">
          Card Database
        </Link>
        <Link className="nav-link" to="/decks">
          Deck Database
        </Link>
        {!isAuthenticated ? (
          <>
            <Link className="nav-link" to="/login">
              Log in
            </Link>
            <Link className="nav-link" to="/signup">
              Sign up
            </Link>
          </>
        ) : (
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
