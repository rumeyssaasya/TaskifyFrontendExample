import React, { useState } from 'react';
import api from '../../api/axios';
import './EditTask.css';
import type { Task } from '../../types';

interface EditTaskProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      projectId: task.projectId // Mevcut proje ID'sini gönder (null olabilir)
    };

    const response = await api.put<Task>(`/tasks/${task.id}`, payload);

    onSave({
      ...response.data,
      // API'den gelen projectId null ise bile mevcut durumu koru
      projectId: response.data.projectId ?? task.projectId 
    });

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
          <select
            value={status}
            onChange={e => setStatus(e.target.value as typeof status)}
            disabled={loading}
          >
            <option value="TO_DO">Yapılacak</option>
            <option value="IN_PROGRESS">Devam Ediyor</option>
            <option value="COMPLETED">Tamamlandı</option>
          </select>
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