import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/"); // Redirect to home page or login page
  };

  return (
    <Nav>
      <Link to="/">
        <Logo src={logo} alt="Logo" />
      </Link>
      <NavLinks>
        <Link to="/carddatabase">Card Database</Link>
        <Link to="/decks">Deck Database</Link>
        {!isAuthenticated ? (
          <>
            <StyledLink to="/login">Log in</StyledLink>
            <StyledLink to="/signup">Sign up</StyledLink>
          </>
        ) : (
          <LogoutButton onClick={handleLogout}>Log out</LogoutButton>
        )}
      </NavLinks>
    </Nav>
  );
};

export default NavBar;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
`;

const Logo = styled.img`
  width: auto;
  height: clamp(34px, calc(2.125rem + ((1vw - 3.9px) * 1.0458)), 50px);
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #000;
  font-weight: bold;
  cursor: pointer;
`;
