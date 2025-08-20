import axios from "axios";
// Create an axios instance if not already available
const api = axios.create();

const ProtectedRoute = () => {
// api.ts içinde (tek seferlik interceptor)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

};

export default ProtectedRoute;
