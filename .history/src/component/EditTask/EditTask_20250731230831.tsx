import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './EditTask.css';
import type { Task } from '../../types';
import ReactDOM from 'react-dom';
interface EditTaskProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'TO_DO', label: 'Yapılacak' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
  { value: 'DONE', label: 'Tamamlandı' } // For backward compatibility
];

const EditTask: React.FC<EditTaskProps> = ({ task, onSave, onCancel }) => {
  useEffect(() => {
    // Modal açıldığında
    document.body.style.overflow = 'hidden';
    return () => {
      // Modal kapanınca
      document.body.style.overflow = '';
    };
  }, []);

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(task.description?.length || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.put<Task>(`/tasks/${task.id}`, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        projectId: task.projectId
      });

      onSave({
        ...response.data,
        projectId: response.data.projectId ?? task.projectId
      });

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Görev güncellenirken bir hata oluştu.');
      console.error("Görev güncelleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'description') {
      setCharCount(value.length);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Görevi Düzenle</h2>
          <button 
            className="close-button" 
            onClick={onCancel}
            aria-label="Kapat"
            disabled={loading}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Başlık*</label>
            <input
              id="title"
              name="title"
              className="input"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Görev başlığı"
              required
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              className="input"
              placeholder="Görev açıklaması (en fazla 255 karakter)"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              maxLength={255}
            />
            <div className="char-counter">{charCount}/255</div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Durum*</label>
            <select
              id="status"
              name="status"
              className="input"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              required
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              <span role="alert">{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel} 
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Kaydediliyor...
                </>
              ) : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;