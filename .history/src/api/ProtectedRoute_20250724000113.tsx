import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const isValid = token && token.trim() !== ""; // Token boş değilse

  return isValid ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
