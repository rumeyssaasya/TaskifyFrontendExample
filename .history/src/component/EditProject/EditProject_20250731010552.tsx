import React, { useState } from 'react';
import api from '../../api/axios';
import './EditProject.css';
import type { Project } from '../../types';

interface EditProjectProps {
  project: Pick<Project, 'id' | 'name' | 'description'>;
  onSave: (updatedProject: Pick<Project, 'id' | 'name' | 'description'>) => void;
  onCancel: () => void;
}

const EditProject: React.FC<EditProjectProps> = ({ 
  project: { id, name: initialName = '', description: initialDesc = '' }, 
  onSave, 
  onCancel 
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDesc);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put<Project>(`/projects/${id}`, {
        name,
        description
      });
      
      onSave({
        id,
        name: response.data.name,
        description: response.data.description
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

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Projeyi Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-name">Proje Adı</label>
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
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="project-desc">Açıklama</label>
            <textarea
              id="project-desc"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Açıklama"
              disabled={loading}
              aria-label="Proje açıklaması"
              rows={4}
            />
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

export default EditProject;