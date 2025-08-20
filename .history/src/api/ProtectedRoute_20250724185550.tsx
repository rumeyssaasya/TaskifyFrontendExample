import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Interceptor Token:", token);

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
