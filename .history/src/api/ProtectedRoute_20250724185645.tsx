import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Create an axios instance if not already available
const api = axios.create();

const ProtectedRoute = () => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      console.log("Interceptor Token:", token);

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: unknown) => Promise.reject(error)
  );

  return null;
};

export default ProtectedRoute;
