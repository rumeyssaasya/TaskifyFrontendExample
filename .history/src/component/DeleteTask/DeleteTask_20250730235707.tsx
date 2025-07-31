import React, { useState } from 'react';
import api from 'axios';
import './DeleteTask.css';

interface DeleteTaskProps {
  taskId: string;
  taskName: string;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteTask: React.FC<DeleteTaskProps> = ({ taskId, taskName, onDelete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`http://localhost:5000/api/tasks/${taskId}`);
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
        <h2>Görevi Sil</h2>
        <p>"{taskName}" adlı görevi silmek istediğinize emin misiniz?</p>
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

export default DeleteTask;
