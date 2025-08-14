import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './profile.css';
import type { UserInfo } from '../../types';
import ChangePasswordForm from '../../component/changePassword/changePassword';
import img1 from '../../assets/images/1.png';
import img2 from '../../assets/images/2.png';
import img3 from '../../assets/images/3.png';

const profileImages = [
  img1,
  img2,
  img3,
];

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
        setTempProfileImage(data.profileImageUrl ? `http://localhost:8080${data.profileImageUrl}` : '');
      } catch {
        setError('Profil bilgileri yüklenirken hata oluştu');
      }
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (editMode && profile) {
      setTempFullName(profile.fullName);
      setTempProfileImage(profile.profileImageUrl ? `http://localhost:8080${profile.profileImageUrl}` : '');
      setError('');
      setSuccess('');
    }
    setEditMode(!editMode);
  };

  const handleImageSelect = (img: string) => {
    setTempProfileImage(img);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedImageUrl = tempProfileImage.replace('http://localhost:8080', '');
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

      <h1 className='profileInfo'>Profil Bilgilerim</h1>
      <hr />

      <div className="profile-main">
        <div className="profile-image-wrapper">
          <div className="profile-image-box">
            <img
              src={tempProfileImage || '/default-profile.png'}
              alt="Profil Resmi"
              className="profile-img"
              onError={e => (e.currentTarget.src = '/default-profile.png')}
            />
          </div>
          {editMode && (
            <div className="profile-image-selection">
              {profileImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Profil Seçenek ${idx + 1}`}
                  className={`selectable-image ${tempProfileImage === img ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(img)}
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
        <h3 onClick={() => setShowChangePassword(prev => !prev)} style={{ cursor: 'pointer' }}>
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
