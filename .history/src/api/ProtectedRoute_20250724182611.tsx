import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Her istekten önce token'ı ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
