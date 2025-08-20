import React, { useState } from "react";
import "./taskCard.css";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";
import type { Task } from "../../types";

interface TaskCardProps {
  task: Task;
  fetchTasks: () => void;
}

const statusLabels: Record<string, string> = {
  TO_DO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  COMPLETED: "Tamamlandı",
};

const getStatusClass = (status: string): string => {
  const statusClasses = {
    TO_DO: "todo",
    IN_PROGRESS: "in-progress",
    COMPLETED: "done",
  };
  return statusClasses[status as keyof typeof statusClasses] || "todo";
};

const TaskCard: React.FC<TaskCardProps> = ({ task, fetchTasks }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const handleTaskUpdated = () => {
    setShowEditForm(false);
    fetchTasks();
  };

  const handleTaskDeleted = () => {
    setShowDeleteConfirm(false);
    fetchTasks();
  };

  return (
    <div className="task-card-container">
      <div className="task-card">
        <div className="task-header">
          <span className={`task-status ${getStatusClass(task.status)}`}>
            {statusLabels[task.status] || "Bilinmiyor"}
          </span>
          <h3 className="task-title">{task.title}</h3>
        </div>
        
        <p className="task-description">{task.description}</p>
        <button 
          className="task-btn toggle-description" 
          onClick={() => setDescriptionExpanded(!descriptionExpanded)}
        >
          {descriptionExpanded ? "Daha Az Göster" : "Daha Fazla Göster"}
        </button>
        <div className="task-footer">
          <div className="task-actions">
            <button 
              className="task-btn edit" 
              onClick={() => setShowEditForm(true)}
              aria-label="Görevi düzenle"
            >
              Düzenle
            </button>
            <button 
              className="task-btn delete" 
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Görevi sil"
            >
              Sil
            </button>
          </div>
        </div>
      </div>

      {showEditForm && (
        <EditTask 
          task={task} // Tüm task bilgilerini gönderiyoruz
          onSave={(updatedTask) => {
            setShowEditForm(false);
            fetchTasks(); // Görev listesini yeniliyoruz
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteTask 
          taskId={task.id}
          taskName={task.title}
          onDelete={handleTaskDeleted}
          onCancel={() => setShowDeleteConfirm(false)}
        />
)}
    </div>
  );
};

export default TaskCard;