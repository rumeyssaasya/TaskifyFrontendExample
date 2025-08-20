import React, { useState } from 'react';
import api from '../../api/axios'; // API çağrıları için axios kullanılıyor
import './addMember.css'; // Stil dosyası

interface AddMemberProps {
  projectId: number;
  onMemberAdded?: () => void; // Üye eklendikten sonra üst component bilgilendirilebilir
}

const AddMember: React.FC<AddMemberProps> = ({ projectId, onMemberAdded }) => {
  // Kullanıcıdan alınan username
  const [username, setUsername] = useState('');
  // Buton ve input disable için yüklenme durumu
  const [loading, setLoading] = useState(false);
  // Backend’den gelen mesaj (başarı veya hata)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Projeye kullanıcı ekleme fonksiyonu
  const handleAddMember = async () => {
    if (!username.trim()) {
      setMessage({ text: 'Lütfen kullanıcı adını giriniz.', isError: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Backend API çağrısı: username query parametre olarak gönderiliyor
      const response = await api.post(
        `/projects/${projectId}/share`, 
        null, 
        { params: { username } }
      );

      setMessage({ text: 'Kullanıcı başarıyla eklendi!', isError: false });
      setUsername('');
      // Üst component bilgilendiriliyor (isteğe bağlı)
      if (onMemberAdded) onMemberAdded();
    } catch (error: any) {
      // Backend’den dönen hata mesajını alıyoruz
      const errorMsg = error.response?.data || 'Kullanıcı eklenirken hata oluştu.';
      setMessage({ text: errorMsg, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 320 }}>
      <label htmlFor="usernameInput">Ekip Arkadaşı Kullanıcı Adı:</label>
      <input
        type="text"
        id="usernameInput"
        value={username}
        onChange={e => setUsername(e.target.value)}
        disabled={loading}
        placeholder="Kullanıcı adı giriniz"
        style={{ width: '100%', padding: 8, margin: '8px 0' }}
      />
      <button
        onClick={handleAddMember}
        disabled={loading}
        style={{ width: '100%', padding: 10, fontSize:'20px',backgroundColor: '#6d84f6ff' , cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Ekleniyor...' : 'Ekle'}
      </button>

      {message && (
        <p style={{ marginTop: 12, color: message.isError ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default AddMember;
