import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ChangePasswordForm from '../../component/changePassword/changePassword';

import type { UserInfo } from '../../types';
import './profile.css';
import { useNavigate } from "react-router-dom";



function ProfilePage() {
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tempFullName, setTempFullName] = useState('');
  const [tempProfileImage, setTempProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const backendBaseUrl = 'https://taskifybackendapi-production.up.railway.app';

  // Backend'deki profil resim seçenekleri
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        const data = response.data as UserInfo;
        setProfile(data);
        setTempFullName(data.fullName);

        // Backend'den gelen URL neyse onu kullan (cinsiyet ikonu da olabilir)
        if (data.profileImageUrl) {
          // Eğer URL zaten tam URL ise direkt kullan, değilse base URL ekle
          if (data.profileImageUrl.startsWith('http')) {
            setTempProfileImage(data.profileImageUrl);
          } else {
            setTempProfileImage(`${backendBaseUrl}${data.profileImageUrl}`);
          }
        } else {
          // Hiç profil resmi yoksa cinsiyete göre default ata
          if (data.gender === 'FEMALE') {
            setTempProfileImage(`${backendBaseUrl}/images/femaleIcon.png`);
          } else if (data.gender === 'MALE') {
            setTempProfileImage(`${backendBaseUrl}/images/maleIcon.png`);
          } else {
            setTempProfileImage(`${backendBaseUrl}/images/default.png`);
          }
        }
      } catch {
        setError('Profil bilgileri yüklenirken hata oluştu');
      }
    };
    fetchProfile();
  }, [backendBaseUrl]);

  const handleEditToggle = () => {
    if (editMode && profile) {
      // İptal edildiğinde orijinal profile image'a dön
      setTempFullName(profile.fullName);
      if (profile.profileImageUrl) {
        if (profile.profileImageUrl.startsWith('http')) {
          setTempProfileImage(profile.profileImageUrl);
        } else {
          setTempProfileImage(`${backendBaseUrl}${profile.profileImageUrl}`);
        }
      } else {
        // Hiç profil resmi yoksa cinsiyete göre default ata
        if (profile.gender === 'FEMALE') {
          setTempProfileImage(`${backendBaseUrl}/images/femaleIcon.png`);
        } else if (profile.gender === 'MALE') {
          setTempProfileImage(`${backendBaseUrl}/images/maleIcon.png`);
        } else {
          setTempProfileImage(`${backendBaseUrl}/images/default.png`);
        }
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
      // Backend'e gönderilecek URL'yi hazırla
      let relativeImageUrl = tempProfileImage;
      
      // Eğer base URL içeriyorsa, sadece path kısmını al
      if (tempProfileImage.startsWith(backendBaseUrl)) {
        relativeImageUrl = tempProfileImage.replace(backendBaseUrl, '');
      }

      // Eğer cinsiyet ikonlarından biri seçiliyse, backend'in atadığı şekilde kalması için null gönder
      if (relativeImageUrl.includes('femaleIcon') || relativeImageUrl.includes('maleIcon')) {
        relativeImageUrl = ''; // Backend cinsiyete göre otomatik atayacak
      }

      await api.put('/profile', {
        fullName: tempFullName,
        profileImageUrl: relativeImageUrl || null, // Boşsa null gönder
      });

      // Başarılı güncellemeden sonra profili yeniden çek
      const response = await api.get('/profile');
      const updatedProfile = response.data as UserInfo;
      setProfile(updatedProfile);

      setSuccess('Profil başarıyla güncellendi');
      setEditMode(false);
    } catch {
      setError('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Mevcut resmin cinsiyet ikonu olup olmadığını kontrol et
  const isGenderIcon = tempProfileImage.includes('femaleIcon') || tempProfileImage.includes('maleIcon');

  if (!profile) return <div>Yükleniyor...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <p className="navbar-brand" onClick={() => navigate("/projects")} style={{ cursor: "pointer" }}>Taskify</p>
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
                // Fallback: cinsiyete göre default ikon
                const target = e.currentTarget as HTMLImageElement;
                if (profile.gender === 'FEMALE') {
                  target.src = `${backendBaseUrl}/images/femaleIcon.png`;
                } else if (profile.gender === 'MALE') {
                  target.src = `${backendBaseUrl}/images/maleIcon.png`;
                } else {
                  target.src = `${backendBaseUrl}/images/default.png`;
                }
              }}
            />
            {isGenderIcon && !editMode && (
              <div className="gender-icon-info">
                <span>Cinsiyetinize göre otomatik atanmış ikon</span>
              </div>
            )}
          </div>
          {editMode && (
            <div className="profile-image-selection">
              <h4>Profil Resmi Seçin</h4>
              {isGenderIcon && (
                <div className="current-gender-info">
                  <p>Şu anda cinsiyetinize göre otomatik atanmış bir ikon kullanıyorsunuz.</p>
                </div>
              )}
              <div className="image-options-grid">
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
              <div className="keep-gender-option">
                <button 
                  className={`btn-gender ${isGenderIcon ? 'active' : ''}`}
                  onClick={() => {
                    // Cinsiyet ikonuna geri dön
                    if (profile.gender === 'FEMALE') {
                      setTempProfileImage(`${backendBaseUrl}/images/femaleIcon.png`);
                    } else if (profile.gender === 'MALE') {
                      setTempProfileImage(`${backendBaseUrl}/images/maleIcon.png`);
                    } else {
                      setTempProfileImage(`${backendBaseUrl}/images/default.png`);
                    }
                  }}
                >
                  Cinsiyet İkonunu Kullan
                </button>
              </div>
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