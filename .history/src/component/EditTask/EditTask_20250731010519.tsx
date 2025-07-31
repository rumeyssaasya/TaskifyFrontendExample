import React, { useState } from 'react';
import api from '../../api/axios';
import './EditTask.css';
import type { Task } from '../../types';

interface EditTaskProps {
  task: {
    id: number;
    title: string;
    description: string;
    status?: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  };
  onSave: () => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // API endpoint'i proje konvansiyonuna göre ayarla
      await api.put(`/tasks/${task.id}`, {
        title,
        description,
      });
      onSave();  // Kaydetme sonrası listeyi yenile veya modal kapat
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Görevi Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Başlık"
            required
            disabled={loading}
          />
          <textarea
            className="input"
            value={description}
            onChange={e => setDescription(e.target.value)}
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

export default EditTask;
