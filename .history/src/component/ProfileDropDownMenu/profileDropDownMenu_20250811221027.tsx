import { useState } from "react";
import type { UserInfo } from "../../types";
import "./profileDropDownMenu.css";

import img1 from '../../assets/images/1.png';
import img2 from '../../assets/images/2.png';
import img3 from '../../assets/images/3.png';

const profileImagesMap: Record<string, string> = {
  '../../assets/images/profile1.png': img1,
  '../../assets/images/profile2.png': img2,
  '../../assets/images/profile3.png': img3,
  '../../assets/images/profile4.png': img4,
  '../../assets/images/profile5.png': img5,
  '../../assets/images/profile6.png': img6,
  '../../assets/images/profile7.png': img7,
  '../../assets/images/profile8.png': img8,
  '../../assets/images/profile9.png': img9,
  '../../assets/images/profile10.png': img10,
};

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
  onSettingsClick,
  onLogout
}: ProfileDropdownProps) {
  if (!show) return null;

  const backendBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const [imgSrc, setImgSrc] = useState(
    userInfo.profileImageUrl
      ? `${backendBaseUrl}${userInfo.profileImageUrl}`
      : img1
  );

  return (
    <div className="profile-dropdown">
      <div className="profile-header">
        <div className="profile-avatar-large">
          <img
            className="profileImg"
            src={imgSrc}
            alt="Profil Resmi"
            onError={() => {
              if (userInfo.profileImageUrl && localImagesMap[userInfo.profileImageUrl]) {
                setImgSrc(localImagesMap[userInfo.profileImageUrl]);
              } else {
                setImgSrc(img1);
              }
            }}
          />
        </div>
        <div className="profile-info">
          <div className="profile-name-large">{userInfo.fullName}</div>
          <div className="profile-email">{userInfo.email}</div>
        </div>
      </div>
      <div className="profile-menu">
        <button className="profile-menu-item" onClick={onProfileClick}>
          <span className="menu-icon">👤</span>
          Profil
        </button>
        <button className="profile-menu-item" onClick={onSettingsClick}>
          <span className="menu-icon">⚙️</span>
          Ayarlar
        </button>
        <div className="profile-divider"></div>
        <button className="profile-menu-item logout-item" onClick={onLogout}>
          <span className="menu-icon">🚪</span>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
