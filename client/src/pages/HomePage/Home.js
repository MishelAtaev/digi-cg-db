import Introduction from "./Introduction";
import Rules from "./Rules";
import TCGPlus from "./TCGPlus";

const Home = () => {
  return (
    <div className="container">
      <div className="section">
        <h1>Digimon Card Nexus</h1>
        <h2>Aiming to be your first stop for anything Digimon TCG</h2>
        <Introduction />
        <Rules />
        <TCGPlus />
      </div>
    </div>
  );
};

export default Home;
