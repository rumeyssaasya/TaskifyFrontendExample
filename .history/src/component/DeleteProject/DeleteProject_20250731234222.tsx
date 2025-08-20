import React, { useState } from 'react';
import './DeleteProject.css';
import api from '../../api/axios';
import type { Project } from '../../types';
import ReactDOM from 'react-dom';
interface DeleteProjectProps {
  project: Project;
  onDelete: (projectId:number) => void;
  onCancel: () => void;
}

const DeleteProject: React.FC<DeleteProjectProps> = ({ project, onDelete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/projects/${project.id}`);
      onDelete();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Proje silinirken bir hata oluştu.');
      console.error('Proje silme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal((
    <div className="modal-overlay">
      <div className="modal">
        <h2>Projeyi Sil</h2>
        <p>"{project.projectName}" adlı projeyi silmek istediğinize emin misiniz?</p>
        {error && <div className="error-message">{error}</div>}
        <div className="modal-actions">
          <button 
            className="btn btn-danger" 
            onClick={handleDelete} 
            disabled={loading}
            aria-label="Projeyi sil"
          >
            {loading ? 'Siliniyor...' : 'Evet, Sil'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onCancel} 
            disabled={loading}
            aria-label="Silme işlemini iptal et"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  ), document.body);
};

export default DeleteProject;