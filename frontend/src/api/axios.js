import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Shto automatikisht token-in në çdo kërkesë (nëse ekziston)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
