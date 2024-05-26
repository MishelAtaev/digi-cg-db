const API_URL = "http://localhost:5000/api/cards";

export const fetchCards = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
};
