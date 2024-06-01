import React, { useState } from "react";

const CardSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    color: "",
    type: "",
    attribute: "",
    desc: "",
    card: "",
    pack: "",
    sort: "",
    sortdirection: "",
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    onSearch(searchParams);
  };

  return (
    <div>
      <h2>Search Digimon Cards</h2>
      <div>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <select name="color" onChange={handleChange}>
          <option value="">Select Color</option>
          <option value="Black">Black</option>
          <option value="Blue">Blue</option>
          <option value="Colorless">Colorless</option>
          <option value="Green">Green</option>
          <option value="Purple">Purple</option>
          <option value="Red">Red</option>
          <option value="White">White</option>
          <option value="Yellow">Yellow</option>
        </select>
        <select name="type" onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="Digimon">Digimon</option>
          <option value="Option">Option</option>
          <option value="Tamer">Tamer</option>
          <option value="Digi-Egg">Digi-Egg</option>
        </select>
        <select name="attribute" onChange={handleChange}>
          <option value="">Select Attribute</option>
          <option value="Vaccine">Vaccine</option>
          <option value="Virus">Virus</option>
          <option value="Data">Data</option>
        </select>
        <input name="desc" placeholder="Description" onChange={handleChange} />
        <input name="card" placeholder="Card Number" onChange={handleChange} />
        <input name="pack" placeholder="Pack Name" onChange={handleChange} />
        <select name="sort" onChange={handleChange}>
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="power">Power</option>
          <option value="code">Code</option>
          <option value="color">Color</option>
          <option value="random">Random</option>
        </select>
        <select name="sortdirection" onChange={handleChange}>
          <option value="">Sort Direction</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default CardSearch;
