import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Token'ı temizle
  };
  return (
    <div>
        <button type="button" onClick={() => navigate("/projects")}>ProjeLerim</button>
        <button type="button" onClick={() => navigate("/tasks")}>Görevlerim</button>
        <button type="button" onClick={() => navigate("/auth/login")}>çıkış yap</button>
    </div>  )
}

export default Navbar
