//login olmadan UI tarafa erişim sağlanmasını engellemek için
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/auth/login" replace /> ;// token varsa içeriye yönlendir, yoksa login sayfasına yönlendir
};

export default ProtectedRoute;
