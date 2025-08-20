import React, { useState } from 'react';
import api from '../../api/axios';
import './EditProject.css';
import type { Project } from '../../types';

interface EditProjectProps {
  project: Project;
  onSave: (updatedProject: Project) => void;
  onCancel: () => void;
}

const EditProject: React.FC<EditProjectProps> = ({ project, onSave, onCancel }) => {
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

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Projeyi Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Proje Adı</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows={4}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onCancel}
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;