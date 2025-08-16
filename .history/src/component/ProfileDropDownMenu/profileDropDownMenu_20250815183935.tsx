import { useState } from "react";
import type { UserInfo } from "../../types";
import "./profileDropDownMenu.css";

interface ProfileDropdownProps {
  userInfo: UserInfo;
  show: boolean;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

function ProfileDropdown({
  userInfo,
  show,
  onProfileClick,
  onLogout
}: ProfileDropdownProps) {
  if (!show) return null;

  const backendBaseUrl = "https://213.142.148.50:8080/";

  const defaultImage = `${backendBaseUrl}/images/default.png`;

  const [imgSrc, setImgSrc] = useState(
    userInfo.profileImageUrl
      ? `${backendBaseUrl}${userInfo.profileImageUrl}`
      : defaultImage
  );

  return (
    <div className="profile-dropdown">
      <div className="profile-header">
        <div className="profile-avatar-large">
          <img
            className="profileImg"
            src={imgSrc}
            alt="Profil Resmi"
            onError={() => setImgSrc(defaultImage)}
          />
        </div>
        <div className="profile-info">
          <div className="profile-name-large">{userInfo.fullName}</div>
          <div className="profile-email">{userInfo.email}</div>
        </div>
      </div>
      <div className="profile-menu">
        <button className="profile-menu-item" onClick={onProfileClick}>
          <span className="menu-icon">⚙️</span> Ayarlar
        </button>

        <div className="profile-divider"></div>
        <button className="profile-menu-item logout-item" onClick={onLogout}>
          <span className="menu-icon">🚪</span> Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
