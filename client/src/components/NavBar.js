import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../images/DIGICARDNEXUS.png";

const NavBar = () => {
  return (
    <>
      <nav>
        <Link to="/">
          <Logo src={logo} alt="Logo" />
          {/* mobileSrc={logoMobile} to include above for mobile logo maybe later */}
        </Link>
        <div>
          <Link to="/">Card Database</Link>
          <Link to="/">Deck Creation</Link>
          <Link to="/">Deck Database</Link>
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
