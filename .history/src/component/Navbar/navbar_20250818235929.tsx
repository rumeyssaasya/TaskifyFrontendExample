import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ProfileDropdown from "../ProfileDropDownMenu/profileDropDownMenu";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: 0,
    fullName: "Kullanıcı",
    email: "user@example.com"
  });
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);
  const navbarRef = useRef(null);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }
        const response = await api.get("/profile");
        setUserInfo(response.data);
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
        const userData = localStorage.getItem("userInfo");
        if (userData) setUserInfo(JSON.parse(userData));
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/auth/login");
  };

  return (
    <>
      <nav className="navbar" ref={navbarRef}>
        <div className="navbar-container">
          <div className="navbar-brand-container">
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mobile Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
            <p className="navbar-brand">Taskify</p>
          </div>
          
          <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <button 
                className="navbar-item" 
                onClick={() => handleNavigation("/projects")}
              >
                Projelerim
              </button>
            </li>
            <li>
              <button 
                className="navbar-item" 
                onClick={() => handleNavigation("/tasks")}
              >
                Görevlerim
              </button>
            </li>
            <li className="profile-section" ref={profileRef}>
              <div className="profile-container">
                {loading ? (
                  <button className="profile-btn" disabled>
                    <div className="profile-avatar">...</div>
                  </button>
                ) : (
                  <button 
                    className="profile-btn" 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    aria-expanded={showProfileMenu}
                  >
                    <div className="profile-avatar">
                      {userInfo.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`profile-arrow ${showProfileMenu ? 'rotated' : ''}`}>
                      ▼
                    </span>
                  </button>
                )}
                
                <ProfileDropdown
                  userInfo={userInfo}
                  show={showProfileMenu}
                  onProfileClick={() => handleNavigation("/profile")}
                  onSettingsClick={() => handleNavigation("/settings")}
                  onLogout={handleLogout}
                />
              </div>
            </li>
          </ul>
        </div>
      </nav>
      
      <main className="main-content">
        {/* Your page content will be rendered here */}
      </main>
    </>
  );
}

export default Navbar;