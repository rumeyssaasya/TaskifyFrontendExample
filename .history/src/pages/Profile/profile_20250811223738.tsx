import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ChangePasswordForm from '../../component/changePassword/changePassword';
import img1 from '../../assets/images/profile1.png';
import img2 from '../../assets/images/profile2.png';
import img3 from '../../assets/images/profile3.png';
import img4 from '../../assets/images/profile4.png';
import img5 from '../../assets/images/profile5.png';
import img6 from '../../assets/images/profile6.png';
import img7 from '../../assets/images/profile7.png';
import img8 from '../../assets/images/profile8.png';
import img9 from '../../assets/images/profile9.png';
import img10 from '../../assets/images/profile10.png';


import type { UserInfo } from '../../types';
import './profile.css';

const profileImagePaths = [
  '../../assets/images/profile1.png',
  '../../assets/images/profile2.png',
  '../../assets/images/profile3.png',
  '../../assets/images/profile4.png',
  '../../assets/images/profile5.png',
  '../../assets/images/profile6.png',
  '../../assets/images/profile7.png',
  '../../assets/images/profile8.png',
  '../../assets/images/profile9.png',
  '../../assets/images/profile10.png',
];

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

function ProfilePage() {
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tempFullName, setTempFullName] = useState('');
  const [tempProfileImage, setTempProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        const data = response.data as UserInfo;
        setProfile(data);
        setTempFullName(data.fullName);

        // Backend'den gelen URL'den sadece path kısmını al
        let path = '';
        if (data.profileImageUrl) {
          const match = data.profileImageUrl.match(/([^\/]+)$/);
          path = match ? `images/${match[1]}` : '';
        }
        setTempProfileImage(path);
      } catch {
        setError('Profil bilgileri yüklenirken hata oluştu');
      }
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (editMode && profile) {
      setTempFullName(profile.fullName);
      let path = '';
      if (profile.profileImageUrl) {
        const match = profile.profileImageUrl.match(/([^\/]+)$/);
        path = match ? `images/profile${match[1]}` : '';
      }
      setTempProfileImage(path);
      setError('');
      setSuccess('');
    }
    setEditMode(!editMode);
  };

  const handleImageSelect = (imgPath: string) => {
    setTempProfileImage(imgPath);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedImageUrl = tempProfileImage.replace('images/', '/images/');

      if (tempFullName !== profile.fullName || updatedImageUrl !== profile.profileImageUrl) {
        await api.put('/profile', {
          fullName: tempFullName,
          profileImageUrl: updatedImageUrl,
        });

        setProfile({
          ...profile,
          fullName: tempFullName,
          profileImageUrl: updatedImageUrl,
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
              src={tempProfileImage ? profileImagesMap[tempProfileImage] : img1}
              alt="Profil Resmi"
              className="profile-img"
              onError={e => (e.currentTarget.src = '/default-profile.png')}
            />
          </div>
          {editMode && (
            <div className="profile-image-selection">
              {profileImagePaths.map((imgPath) => (
                <img
                  key={imgPath}
                  src={profileImagesMap[imgPath]}
                  alt={`Profil Seçenek ${imgPath}`}
                  className={`selectable-image ${tempProfileImage === imgPath ? 'selected' : ''}`}
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
