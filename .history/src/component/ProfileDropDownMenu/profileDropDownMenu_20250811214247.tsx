import type { UserInfo } from "../../types";
import "./profileDropDownMenu.css";
import img1 from '../../assets/images/1.png';
import img2 from '../../assets/images/2.png';
import img3 from '../../assets/images/3.png';

const profileImagePaths = [
  'images/1.png',
  'images/2.png',
  'images/3.png',
];

const profileImagesMap: Record<string, string> = {
  'images/1.png': img1,
  'images/2.png': img2,
  'images/3.png': img3,
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
  console.log("Profil resmi URL'si:", userInfo.profileImageUrl);

  return (
    <div className="profile-dropdown">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {profileImagePaths.map((imgPath) => (
                <img
                  key={imgPath}
                  src={profileImagesMap[imgPath]}
                  alt={`Profil Seçenek ${imgPath}`}
                  className={`profileImg ${tempProfileImage === imgPath ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(imgPath)}
                  loading="lazy"
                />
              ))}   
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