import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './EditProject.css';
import type { Project } from '../../types';

interface EditProjectProps {
  project: Project;
  onSave: (updatedProject: Project) => void;
  onCancel: () => void;
}

const EditProject: React.FC<EditProjectProps> = ({ 
  project: { id, projectName: initialName = '', description: initialDesc = '' }, 
  onSave, 
  onCancel 
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDesc);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(initialDesc.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      setError('Proje adı boş olamaz');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put<Project>(`/projects/${id}`, {
        projectName: name.trim(),
        description: description.trim()
      });
      
      onSave({
        id,
        projectName: response.data.projectName,
        description: response.data.description,
        startDate: response.data.startDate,
        endDate: response.data.endDate
      });
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Proje güncellenirken bir hata oluştu';
      setError(errorMessage);
      console.error("Proje güncelleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setCharCount(e.target.value.length);
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
            <label htmlFor="project-name">Proje Adı*</label>
            <input
              id="project-name"
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Proje Adı"
              required
              disabled={loading}
              aria-label="Proje adı"
              maxLength={100}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="project-desc">Açıklama</label>
            <textarea
              id="project-desc"
              className="form-input"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Proje açıklaması (isteğe bağlı)"
              disabled={loading}
              aria-label="Proje açıklaması"
              rows={4}
              maxLength={500}
            />
            <div className="char-counter">{charCount}/500</div>
          </div>
          
          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
              aria-label="Değişiklikleri iptal et"
            >
              İptal
            </button>
            
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
          </div>
        </form>
      </div>
    </div>
  ), document.body);
};

export default EditProject;