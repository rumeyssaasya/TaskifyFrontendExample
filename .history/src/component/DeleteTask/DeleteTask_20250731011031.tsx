import React, { useState } from 'react';
import api from '../../api/axios';
import './DeleteTask.css';
import type { Task } from '../../types';

interface DeleteTaskProps {
  task: number; // Using Task type for consistency
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteTask: React.FC<DeleteTaskProps> = ({ task, onDelete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/tasks/${task.id}`);
      onDelete();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Görev silinirken bir hata oluştu';
      setError(errorMessage);
      console.error("Görev silme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Görevi Sil</h2>
        <p>"{task.title}" adlı görevi silmek istediğinize emin misiniz?</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
            aria-label="Görevi sil"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Siliniyor...
              </>
            ) : (
              'Evet, Sil'
            )}
          </button>
          
          <button
            type="button"
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
  );
};

export default DeleteTask;