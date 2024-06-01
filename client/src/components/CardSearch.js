import { useState } from "react";

const COLORS = ["Black", "Blue", "Green", "Purple", "Red", "White", "Yellow"];
const TYPES = ["Digimon", "Option", "Tamer", "Digi-Egg"];
const ATTRIBUTES = ["Vaccine", "Virus", "Data"];
const SORT_OPTIONS = ["name", "power", "code", "color", "random"];
const SORT_DIRECTIONS = ["asc", "desc"];

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

  // Handle change in input fields
  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  // Trigger search with current parameters
  const handleSearch = () => {
    onSearch(searchParams);
  };

  return (
    <div className="card-search">
      <h2>Search Digimon Cards</h2>
      <div>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <select name="color" onChange={handleChange}>
          <option value="">Select Color</option>
          {COLORS.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
        <select name="type" onChange={handleChange}>
          <option value="">Select Type</option>
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select name="attribute" onChange={handleChange}>
          <option value="">Select Attribute</option>
          {ATTRIBUTES.map((attr) => (
            <option key={attr} value={attr}>
              {attr}
            </option>
          ))}
        </select>
        <select name="sort" onChange={handleChange}>
          <option value="">Sort By</option>
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select name="sortdirection" onChange={handleChange}>
          <option value="">Sort Direction</option>
          {SORT_DIRECTIONS.map((direction) => (
            <option key={direction} value={direction}>
              {direction}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default CardSearch;
