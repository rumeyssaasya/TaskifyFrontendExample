import React, { useState } from 'react';
import './DeleteProject.css';
import api from '../../api/axios';
import type { Project } from '../../types';

interface DeleteProjectProps {
  projectId: string;
  projectName: string;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteProject: React.FC<DeleteProjectProps> = ({ projectId, projectName, onDelete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      // API endpointini kendi backend'ine göre güncelle!
      await api.delete(`http://localhost:5000/api/projects/${projectId}`);
      onDelete();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Projeyi Sil</h2>
        <p>"{projectName}" adlı projeyi silmek istediğinize emin misiniz?</p>
        {error && <div className="error-message">{error}</div>}
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Siliniyor...' : 'Evet, Sil'}
          </button>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
