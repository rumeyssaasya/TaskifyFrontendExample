import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './profile.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    gender: '',
    profileImageUrl: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [tempFullName, setTempFullName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
        setTempFullName(response.data.fullName);
      } catch (err) {
        setError('Profil bilgileri yüklenirken hata oluştu');
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      setTempFullName(profile.fullName);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Dosya validasyonu
      if (file.size > 2 * 1024 * 1024) {
        setError('Dosya boyutu 2MB\'yi aşamaz');
        return;
      }
      
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Yalnızca JPG ve PNG formatları desteklenmektedir');
        return;
      }

      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Önce resmi yükle
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        const uploadResponse = await api.post('/profile/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Yeni resim URL'sini al
        const newImageUrl = uploadResponse.data.profileImageUrl;
        setProfile(prev => ({ ...prev, profileImageUrl: newImageUrl }));
      }

      // Profil bilgilerini güncelle
      if (tempFullName !== profile.fullName) {
        await api.put('/profile', { fullName: tempFullName });
        setProfile(prev => ({ ...prev, fullName: tempFullName }));
      }

      setSuccess('Profil başarıyla güncellendi');
      setEditMode(false);
    } catch (err) {
      setError('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profil Bilgilerim</h1>
        {!editMode ? (
          <button onClick={handleEditToggle} className="edit-btn">
            Düzenle
          </button>
        ) : (
          <div className="edit-actions">
            <button onClick={handleEditToggle} className="cancel-btn">
              İptal
            </button>
            <button 
              onClick={handleSave} 
              className="save-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        <div className="profile-image-section">
          <div className="profile-image-container">
          <img src={`http://localhost:8080${userInfo.profileImageUrl}`} alt="Profil Resmi"
              className="profile-image"
            />
            {editMode && (
              <div className="image-upload">
                <label htmlFor="profile-image-upload" className="upload-btn">
                  Resim Seç
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {selectedFile && (
                  <span className="file-name">{selectedFile.name}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <label>Ad Soyad:</label>
            {editMode ? (
              <input
                type="text"
                value={tempFullName}
                onChange={(e) => setTempFullName(e.target.value)}
                className="edit-input"
              />
            ) : (
              <span>{profile.fullName}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>

          <div className="profile-field">
            <label>Cinsiyet:</label>
            <span>{profile.gender === 'MALE' ? 'Erkek' : profile.gender === 'FEMALE' ? 'Kadın' : 'Belirtilmemiş'}</span>
          </div>
        </div>
      </div>

      <div className="change-password-section">
        <h3>Şifre Değiştir</h3>
        <button 
          onClick={() => navigate('/change-password')} 
          className="change-password-btn"
        >
          Şifre Değiştir
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;