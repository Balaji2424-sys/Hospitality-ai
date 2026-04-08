import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api"
});

export const withToken = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export default api;
