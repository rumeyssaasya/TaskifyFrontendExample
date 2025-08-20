import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import "./navbar.css";
import ProfileDropdown from "../ProfileDropDownMenu/profileDropDownMenu";
import type { UserInfo } from "../../types";


function Navbar() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    fullName: "Kullanıcı",
    email: "user@example.com"
  });
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLLIElement>(null);

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
        if (userData) {
          try {
            setUserInfo(JSON.parse(userData));
          } catch (parseError) {
            console.error("LocalStorage parse hatası:", parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/auth/login");
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileClick = () => {
    console.log("Profil sayfasına yönlendir");
    setShowProfileMenu(false);
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    console.log("Ayarlar sayfasına yönlendir");
    setShowProfileMenu(false);
    navigate("/settings");
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
          <li className="profile-section" ref={profileRef}>
            <div className="profile-container">
              {loading ? (
                <button className="profile-btn" disabled>
                  <div className="profile-avatar">...</div>
                  <span className="profile-name">Yükleniyor...</span>
                  <span className="profile-arrow">▼</span>
                </button>
              ) : (
                <button className="profile-btn" onClick={toggleProfileMenu}>
                  <div className="profile-avatar">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="profile-name">{userInfo.name}</span>
                  <span className={`profile-arrow ${showProfileMenu ? 'rotated' : ''}`}>▼</span>
                </button>
              )}
              
              <ProfileDropdown
                userInfo={userInfo}
                show={showProfileMenu}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogout={handleLogout}
              />
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;