import { useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/projects" className="navbar-brand">Taskify</a>
        <ul className="navbar-menu">
          <li>
            <button className="navbar-item" onClick={() => navigate("/projects")}>
              Projelerim
            </button>
          </li>
          <li>
            <button className="navbar-item" onClick={() => navigate("/tasks")}>
              Görevlerim
            </button>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
