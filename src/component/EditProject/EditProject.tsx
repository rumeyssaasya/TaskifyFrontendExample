import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './EditProject.css';
import type { Project } from '../../types';
import ReactDOM from 'react-dom';

interface EditProjectProps {
  project: Project;
  onSave: (updatedProject: Project) => void;
  onCancel: () => void;
}

const EditProject: React.FC<EditProjectProps> = ({ project, onSave, onCancel }) => {
  useEffect(() => {
    // Modal açıldığında
    document.body.style.overflow = 'hidden';
    return () => {
      // Modal kapanınca
      document.body.style.overflow = '';
    };
  }, []);

  const [formData, setFormData] = useState({
    title: project.projectName,
    description: project.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.put<Project>(`/projects/${project.id}`, {
        projectName: formData.title.trim(),
        description: formData.description.trim()
      });
      
      // Modal'ı sadece başarılı kayıttan sonra kapat
      onSave(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Güncelleme başarısız');
      // Hata durumunda modal kapanmaz
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return ReactDOM.createPortal((
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Projeyi Düzenle</h2>
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
            <label htmlFor="title">Proje Adı*</label>
            <input
              id="title"
              name="title"
              className="form-input"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Proje adı"
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
              className="form-input"
              placeholder="Proje açıklaması"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              maxLength={255}
            />
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
  ), document.body);
};

export default EditProject;