import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ChangePasswordForm from '../../component/changePassword/changePassword';

import type { UserInfo } from '../../types';
import './profile.css';

function ProfilePage() {
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tempFullName, setTempFullName] = useState('');
  const [tempProfileImage, setTempProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const backendBaseUrl = 'http://taskifybackendapi-production-eec2.up.railway.app';

  // Backend'deki profil resim seçenekleri (path olarak)
  const profileImageOptions = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
    '/images/6.png',
    '/images/7.png',
    '/images/8.png',
    '/images/9.png',
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        const data = response.data as UserInfo;
        setProfile(data);
        setTempFullName(data.fullName);

        // Backend'den gelen URL varsa tam url olarak set et, yoksa default
        if (data.profileImageUrl) {
          setTempProfileImage(`${backendBaseUrl}${data.profileImageUrl}`);
        } else {
          setTempProfileImage(`${backendBaseUrl}/images/default.png`);
        }
      } catch {
        setError('Profil bilgileri yüklenirken hata oluştu');
      }
    };
    fetchProfile();
  }, [backendBaseUrl]);

  const handleEditToggle = () => {
    if (editMode && profile) {
      setTempFullName(profile.fullName);
      if (profile.profileImageUrl) {
        setTempProfileImage(`${backendBaseUrl}${profile.profileImageUrl}`);
      } else {
        setTempProfileImage(`${backendBaseUrl}/images/default.png`);
      }
      setError('');
      setSuccess('');
    }
    setEditMode(!editMode);
  };

  const handleImageSelect = (imgPath: string) => {
    setTempProfileImage(`${backendBaseUrl}${imgPath}`);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Backend profilImageUrl'den sadece path kısmını çıkar (ör: /images/profile1.png)
      const relativeImageUrl = tempProfileImage.replace(backendBaseUrl, '');

      if (tempFullName !== profile.fullName || relativeImageUrl !== profile.profileImageUrl) {
        await api.put('/profile', {
          fullName: tempFullName,
          profileImageUrl: relativeImageUrl,
        });

        setProfile({
          ...profile,
          fullName: tempFullName,
          profileImageUrl: relativeImageUrl,
        });

        setSuccess('Profil başarıyla güncellendi');
        setEditMode(false);
      } else {
        setSuccess('Değişiklik yapılmadı');
        setEditMode(false);
      }
    } catch {
      setError('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordChangeSuccess = () => {
    setShowChangePassword(false);
  };

  if (!profile) return <div>Yükleniyor...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <a href="/projects" className="navbar-brand">Taskify</a>
        {!editMode ? (
          <button onClick={handleEditToggle} className="btn-edit-profile">Düzenle</button>
        ) : (
          <div className="profile-edit-actions">
            <button onClick={handleEditToggle} className="btn-cancel">İptal</button>
            <button onClick={handleSave} disabled={isLoading} className="btn-save">
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        )}
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <h1 className="profileInfo">Profil Bilgilerim</h1>
      <hr />

      <div className="profile-main">
        <div className="profile-image-wrapper">
          <div className="profile-image-box">
            <img
              src={tempProfileImage}
              alt="Profil Resmi"
              className="profile-img"
              onError={e => {
                e.currentTarget.src = `${backendBaseUrl}/images/default.png`;
              }}
            />
          </div>
          {editMode && (
            <div className="profile-image-selection">
              {profileImageOptions.map((imgPath) => (
                <img
                  key={imgPath}
                  src={`${backendBaseUrl}${imgPath}`}
                  alt={`Profil Seçenek ${imgPath}`}
                  className={`selectable-image ${tempProfileImage === `${backendBaseUrl}${imgPath}` ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(imgPath)}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-info-item">
            <label>Ad Soyad:</label>
            {editMode ? (
              <input
                type="text"
                value={tempFullName}
                onChange={(e) => setTempFullName(e.target.value)}
                className="input-edit"
              />
            ) : (
              <span>{profile.fullName}</span>
            )}
          </div>

          <div className="profile-info-item">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>

          <div className="profile-info-item">
            <label>Cinsiyet:</label>
            <span>
              {profile.gender === 'MALE' ? 'Erkek' :
                profile.gender === 'FEMALE' ? 'Kadın' :
                  'Belirtilmemiş'}
            </span>
          </div>
        </div>
      </div>

      <div className="change-password-area">
        <h3
          onClick={() => setShowChangePassword(prev => !prev)}
          style={{ cursor: 'pointer' }}
        >
          Şifre Değiştir {showChangePassword ? '▲' : '▼'}
        </h3>
        {showChangePassword && (
          <ChangePasswordForm onSuccess={onPasswordChangeSuccess} />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
