import React from 'react';
import './DeleteProject.css';

interface DeleteProjectProps {
  projectId: number;
  onDelete: (projectId: number) => void; // Parametre eklenmiş
  onCancel: () => void;
}

const DeleteProject: React.FC<DeleteProjectProps> = ({ 
  projectId, 
  onDelete, 
  onCancel 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Projeyi Sil</h2>
        <p>Bu projeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
        
        <div className="modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            İptal
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => onDelete(projectId)} // projectId parametresi geçiliyor
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;