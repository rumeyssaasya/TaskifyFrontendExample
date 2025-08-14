function ProfileDropdown({
  userInfo,
  show,
  onProfileClick,
  onSettingsClick,
  onLogout
}: ProfileDropdownProps) {
  if (!show) return null;

  const backendBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
          <span className="menu-icon">👤</span> Profil
        </button>
        <button className="profile-menu-item" onClick={onSettingsClick}>
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
