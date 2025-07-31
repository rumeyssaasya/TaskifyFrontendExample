import React, { useState } from 'react';
import api from '../../api/axios';
import './DeleteTask.css';
import ReactDOM from 'react-dom';
interface DeleteTaskProps {
  taskId: number;
  taskName: string;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteTask: React.FC<DeleteTaskProps> = ({ taskId, taskName, onDelete, onCancel }) => {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/tasks/${taskId}`);
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

  return ReactDOM.createPortal( (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Görevi Sil</h2>
        <p>"{taskName}" adlı görevi silmek istediğinize emin misiniz?</p>
        
        {error && <div className="error-message">{error}</div>}

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
                <span className="spinner" aria-hidden="true" />
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
  ), document.body);
};

export default DeleteTask;