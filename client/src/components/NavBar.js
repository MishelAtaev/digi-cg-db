import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../images/DIGICARDNEXUS.png";

const NavBar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <>
      <nav>
        <Link to="/">
          <Logo src={logo} alt="Logo" />
        </Link>
        <div>
          <Link to="/">Card Database</Link>
          <Link to="/">Deck Creation</Link>
          <Link to="/">Deck Database</Link>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>Log in</button>
          ) : (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log out
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;

const Logo = styled.img`
  width: auto;
  height: clamp(34px, calc(2.125rem + ((1vw - 3.9px) * 1.0458)), 50px);

  /* @media (max-width: 768px) {
    content: url(${(props) => props.mobileSrc});
    height: clamp(20px, calc(1.25rem + ((1vw - 3.3px) * 6.8493)), 50px);
  } */
`;
