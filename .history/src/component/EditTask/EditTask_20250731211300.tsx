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
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.put<Task>(`/tasks/${task.id}`, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        projectId: task.projectId // Mevcut proje ID'sini koru
      });

      onSave({
        ...response.data,
        projectId: response.data.projectId ?? task.projectId // Proje ID'sini koru
      });

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Bir hata oluştu.');
      console.error("Görev güncelleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Görevi Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            className="input"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Başlık"
            required
            disabled={loading}
          />
          <textarea
            maxLength={255}
            placeholder="Görev açıklamasını girin (En fazla 255 karakter)"
            name="description"
            className="input"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            rows={4}
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="TO_DO">Yapılacak</option>
            <option value="IN_PROGRESS">Devam Ediyor</option>
            <option value="COMPLETED">Tamamlandı</option>
          </select>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel} 
              disabled={loading}
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