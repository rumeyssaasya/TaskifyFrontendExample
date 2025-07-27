import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Token'ı temizle
    navigate("/auth/login"); // Login sayfasına yönlendir
  };
  return (
    <div>
        <button type="button" onClick={() => navigate("/projects")}>ProjeLerim</button>
        <button type="button" onClick={() => navigate("/tasks")}>Görevlerim</button>
        <button type="button" onClick={handleLogout}>çıkış yap</button>
    </div>  )
}

export default Navbar
