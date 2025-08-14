import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './profile.css';

// 12 profil resmi burada import edilebilir veya dinamik yol verilebilir
const profileImages = [
  '/assets/profilePics/1.png',
  '/assets/profilePics/2.png',
  '/assets/profilePics/3.png',
  '/assets/profilePics/4.png',
  '/assets/profilePics/5.png',
  '/assets/profilePics/6.png',
  '/assets/profilePics/7.png',
  '/assets/profilePics/8.png',
  '/assets/profilePics/9.png',
  '/assets/profilePics/10.png',
  '/assets/profilePics/11.png',
  '/assets/profilePics/12.png',
];

interface UserProfile {
  fullName: string;
  profileImageUrl: string;
}
interface UserSettings {
  email: string;
  gender?: string;
  newPassword?: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    profileImageUrl: ''
  });
  const [userSettings, setUserSettings] = useState<UserSettings>({
    email: '',
    gender: ''
  }
);
  const [editMode, setEditMode] = useState(false);
  const [tempFullName, setTempFullName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        const profileData = response.data;
        setProfile(profileData);
        setTempFullName(profileData.fullName);
        // Mevcut profil resmi adresi varsa set et
        if (profileData.profileImageUrl) {
          setSelectedImage(`http://localhost:8080${profileData.profileImageUrl}`);
        }
      } catch (err: any) {
        const message = err.response?.data?.message || 'Profil bilgileri yüklenirken hata oluştu.';
        setError(message);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) return;
    // Düzenleme iptal edildiğinde eski resim ve isim yüklenir
    setTempFullName(profile.fullName);
    setSelectedImage(profile.profileImageUrl ? `http://localhost:8080${profile.profileImageUrl}` : '');
  };

  const handleImageSelect = (img: string) => {
    setSelectedImage(img);
    setError('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Resim URL'si backend formatında olabilir, backendin kabul ettiği şekilde düzenle
      // Burada örnek olarak sadece URL gönderiliyor
      const updatedImageUrl = selectedImage.replace('http://localhost:8080', '');

      if (tempFullName !== profile.fullName || updatedImageUrl !== profile.profileImageUrl) {
        await api.put('/profile', {
          fullName: tempFullName,
          profileImageUrl: updatedImageUrl
        });

        setProfile(prev => ({
          ...prev,
          fullName: tempFullName,
          profileImageUrl: updatedImageUrl
        }));
      }

      setSuccess('Profil başarıyla güncellendi');
      setEditMode(false);
    } catch (err: any) {
      setError('Güncelleme sırasında hata oluştu');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
        <a href="/projects" className="navbar-brand">Taskify</a>
        </div>
        {!editMode ? (
          <button onClick={handleEditToggle} className="btn-edit-profile">
            Düzenle
          </button>
        ) : (
          <div className="profile-edit-actions">
            <button onClick={handleEditToggle} className="btn-cancel">
              İptal
            </button>
            <button onClick={handleSave} className="btn-save" disabled={isLoading}>
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
              src={selectedImage || '/default-profile.png'}
              alt="Profil Resmi"
              className="profile-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-profile.png';
              }}
            />
          </div>

          {editMode && (
            <div className="profile-image-selection">
              {profileImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Profil Seçenek ${idx + 1}`}
                  className={`selectable-image ${selectedImage === img ? 'selected' : ''}`}
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
            <span>{userSettings.email}</span>
          </div>

          <div className="profile-info-item">
            <label>Cinsiyet:</label>
            <span>
              {userSettings.gender === 'MALE' ? 'Erkek' :
                userSettings.gender === 'FEMALE' ? 'Kadın' :
                  'Belirtilmemiş'}
            </span>
          </div>
        </div>
      </div>

      <div className="change-password-area">
        <h3>Şifre Değiştir</h3>
        <button
          onClick={() => navigate('/change-password')}
          className="btn-change-password"
        >
          Şifre Değiştir
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
