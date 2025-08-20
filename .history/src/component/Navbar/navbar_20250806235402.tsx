import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import "./navbar.css";

interface UserInfo {
  id: number;
  name: string;
  email: string;
}

function Navbar() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    name: "Kullanıcı",
    email: "user@example.com"
  });
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // Kullanıcı bilgilerini API'den çek
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
        // Hata durumunda localStorage'dan al (fallback)
        const userData = localStorage.getItem("userInfo");
        if (userData) {
          try {
            const parsed = JSON.parse(userData);
            setUserInfo(parsed);
          } catch (parseError) {
            console.error("LocalStorage'dan kullanıcı bilgileri parse edilemedi:", parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    // Dropdown dışına tıklandığında kapat
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
    // Profil sayfasına yönlendir (gelecekte eklenebilir)
    console.log("Profil sayfasına yönlendir");
    setShowProfileMenu(false);
  };

  const handleSettingsClick = () => {
    // Ayarlar sayfasına yönlendir (gelecekte eklenebilir)
    console.log("Ayarlar sayfasına yönlendir");
    setShowProfileMenu(false);
  };
  
  if (loading) {
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
            <li className="profile-section">
              <div className="profile-container">
                <button className="profile-btn" disabled>
                  <div className="profile-avatar">...</div>
                  <span className="profile-name">Yükleniyor...</span>
                  <span className="profile-arrow">▼</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
  
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
              <button className="profile-btn" onClick={toggleProfileMenu}>
                <div className="profile-avatar">
                  
                </div>
                <span className="profile-name">{userInfo.name}</span>
                <span className={`profile-arrow ${showProfileMenu ? 'rotated' : ''}`}>▼</span>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                      <div className="profile-name-large">{userInfo.name}</div>
                      <div className="profile-email">{userInfo.email}</div>
                    </div>
                  </div>
                  <div className="profile-menu">
                    <button className="profile-menu-item" onClick={handleProfileClick}>
                      <span className="menu-icon">👤</span>
                      Profil
                    </button>
                    <button className="profile-menu-item" onClick={handleSettingsClick}>
                      <span className="menu-icon">⚙️</span>
                      Ayarlar
                    </button>
                    <div className="profile-divider"></div>
                    <button className="profile-menu-item logout-item" onClick={handleLogout}>
                      <span className="menu-icon">🚪</span>
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
