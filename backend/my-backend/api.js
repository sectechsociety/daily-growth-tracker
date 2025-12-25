import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Backend URL
});

// Example: Fetch data from the backend
export const fetchBackendStatus = () => API.get("/");

// Example: Create a user
export const createUser = (userData) => API.post("/user", userData);

export default API;