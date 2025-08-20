import React, { useState } from 'react';
import api from '../../api/axios';
import './EditProject.css';

interface EditProjectProps {
  projectId: string;
  initialName?: string;
  initialDesc?: string;
  onSave: () => void;
  onCancel: () => void;
}

const EditProject: React.FC<EditProjectProps> = ({ projectId, initialName = '', initialDesc = '', onSave, onCancel }) => {
  const [name, setName] = useState(initialName);
  const [desc, setDesc] = useState(initialDesc);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.put(`http://localhost:5000/api/projects/${projectId}`, {
        name,
        description: desc,
      });
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Projeyi Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Proje Adı"
            required
            disabled={loading}
          />
          <textarea
            className="input"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Açıklama"
            disabled={loading}
          />
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
