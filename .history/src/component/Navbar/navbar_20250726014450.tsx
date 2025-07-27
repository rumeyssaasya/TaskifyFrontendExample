import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  return (
    <div>
        <button type="button" onClick={() => navigate("/projects")}>ProjeLerim</button>
        <button type="button" onClick={() => navigate("/tasks")}>Görevlerim</button>
        <button type="button" onClick={() => navigate("/auth/login")}>Profil</button>
    </div>  )
}

export default Navbar
