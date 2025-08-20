import React, { useState } from 'react';
import api from '../../api/axios';
import './EditTask.css';
import type { Task } from '../../types';

interface EditTaskProps {
  task: Pick<Task, 'id' | 'title' | 'description' | 'status'>;
  onSave: (updatedTask: Pick<Task, 'id' | 'title' | 'description' | 'status'>) => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ 
  task: { id, title: initialTitle, description: initialDescription, status: initialStatus = 'TO_DO' }, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState<'TO_DO' | 'IN_PROGRESS' | 'DONE'>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.put<Task>(`/tasks/${id}`, {
        title,
        description,
        status
      });

      onSave({
        id,
        title: response.data.title,
        description: response.data.description,
        status: response.data.status
      });

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Görev güncellenirken bir hata oluştu';
      setError(errorMessage);
      console.error("Görev güncelleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Görevi Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Başlık</label>
            <input
              id="task-title"
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Görev başlığı"
              required
              disabled={loading}
              aria-label="Görev başlığı"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Açıklama</label>
            <textarea
              id="task-description"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Görev açıklaması"
              disabled={loading}
              aria-label="Görev açıklaması"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-status">Durum</label>
            <select
              id="task-status"
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              disabled={loading}
              aria-label="Görev durumu"
            >
              <option value="TO_DO">Yapılacak</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="COMPLETED">Tamamlandı</option>
            </select>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              aria-label="Değişiklikleri kaydet"
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
              aria-label="Değişiklikleri iptal et"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;