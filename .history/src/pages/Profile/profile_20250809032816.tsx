import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './profile.css';
import type { UserInfo } from '../../types';

interface UserProfile {
  fullName: string;
  email: string;
  gender: string;
  profileImageUrl: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
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
        const profileData = response.data;
        setProfile(profileData);
        setTempFullName(profileData.fullName);
        if (profileData.profileImageUrl) {
          setPreviewImage(`http://localhost:8080${profileData.profileImageUrl}`);
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
    if (editMode) {
      setTempFullName(profile.fullName);
      setSelectedFile(null);
      setPreviewImage(profile.profileImageUrl ? `http://localhost:8080${profile.profileImageUrl}` : '');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // File validation
      if (file.size > 3 * 1024 * 1024) {
        setError('Dosya boyutu 3MB\'yi aşamaz');
        return;
      }
      
      if (!['image/jpeg','image/jpeg','image/png'].includes(file.type)) {
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
      let newImageUrl = profile.profileImageUrl;

      // Upload image if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        const uploadResponse = await api.post('/profile/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Upload response', uploadResponse.data);
        newImageUrl = uploadResponse.data.profileImageUrl;
      }

      // Update profile information if changed
      if (tempFullName !== profile.fullName || newImageUrl !== profile.profileImageUrl) {
        await api.put('/profile', { 
          fullName: tempFullName,
          profileImageUrl: newImageUrl
        });
        
        setProfile(prev => ({ 
          ...prev, 
          fullName: tempFullName,
          profileImageUrl: newImageUrl
        }));
      }

      setSuccess('Profil başarıyla güncellendi');
      setEditMode(false);
      setSelectedFile(null);
    } catch (err: any) {
      setError('Güncelleme sırasında hata oluştu');
      console.error('Profile update error:', err);
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
            <img 
              src={previewImage || '/default-profile.png'} 
              alt="Profil Resmi"
              className="profile-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-profile.png';
              }}
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
            <span>
              {profile.gender === 'MALE' ? 'Erkek' : 
               profile.gender === 'FEMALE' ? 'Kadın' : 
               'Belirtilmemiş'}
            </span>
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