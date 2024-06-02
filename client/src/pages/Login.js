import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        formData
      );
      if (response.data.status === 200) {
        setSuccess("Login successful!");
        setIsAuthenticated(true);
        localStorage.setItem("userId", response.data.userId); // Store the userId
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="section">
          <label>Email or Username</label>
          <input
            className="deck-creator-input"
            type="text"
            name="identifier"
            placeholder="Email or Username"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </div>
        <div className="section">
          <label>Password</label>
          <input
            className="deck-creator-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="deck-creator-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
