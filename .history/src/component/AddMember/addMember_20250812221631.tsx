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
   const handleShareProject = async () => {
    if (!shareUserName) return;
    setShareLoading(true);
    setShareError(null);
    setShareSuccess(false);

    try {
      const response = await api.post(`/projects/${projectId}/share`, null, {
        params: { userName: shareUserName },
      });

      setShareSuccess(true);
      setShareUserName("");
      console.log(response.data)
    } catch (error: any) {
      setShareError(error.response?.data || "Paylaşım başarısız oldu.");
    } finally {
      setShareLoading(false);
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
