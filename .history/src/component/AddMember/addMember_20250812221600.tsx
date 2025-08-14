import React, { useState } from 'react';
import api from '../../api/axios'; // API çağrıları için axios kullanılıyor
import './addMember.css'; // Stil dosyası

interface AddMemberProps {
  projectId: number;
  onMemberAdded?: () => void; // Üye eklendikten sonra üst component bilgilendirilebilir
}

const AddMember: React.FC<AddMemberProps> = ({ projectId, onMemberAdded }) => {
  // Kullanıcıdan alınan username
  const [userName, setUserName] = useState('');
  // Buton ve input disable için yüklenme durumu
  const [loading, setLoading] = useState(false);
  // Backend’den gelen mesaj (başarı veya hata)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Projeye kullanıcı ekleme fonksiyonu
  const handleAddMember = async () => {
    if (!userName.trim()) {
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
        { params: { userName } }
      );

      setMessage({ text: 'Kullanıcı başarıyla eklendi!', isError: false });
      setUserName('');
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
              {/* Proje Paylaşma Bölümü */}
          <div className="project-share-section" style={{ margin: "1rem 0" }}>
            <input
              type="text"
              placeholder="Paylaşılacak Kullanıcı ID'si"
              value={shareUserName}
              onChange={(e) => setShareUserName(e.target.value)}
              disabled={shareLoading}
              style={{ padding: "0.5rem", marginRight: "0.5rem", width: "200px" }}
            />
            <button
              onClick={handleShareProject}
              disabled={shareLoading || !shareUserName.trim()}
              style={{ padding: "0.5rem 1rem" }}
            >
              {shareLoading ? "Paylaşılıyor..." : "Projeyi Paylaş"}
            </button>
            {shareError && <p style={{ color: "red", marginTop: "0.5rem" }}>{shareError}</p>}
            {shareSuccess && (
              <p style={{ color: "green", marginTop: "0.5rem" }}>Proje başarıyla paylaşıldı!</p>
            )}
          </div>
    </div>
  );
};

export default AddMember;
