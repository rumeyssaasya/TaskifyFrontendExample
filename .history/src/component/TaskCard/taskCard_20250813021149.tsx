import React, { useState, useRef, useEffect } from "react";
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
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      // Eğer açıklama metni 3 satırdan fazla ise "Daha Fazla Göster" butonunu göster
      const lineHeight = parseInt(getComputedStyle(descriptionRef.current).lineHeight);
      const maxHeight = lineHeight * 3;
      setShowReadMore(descriptionRef.current.scrollHeight > maxHeight);
    }
  }, [task.description]);

  const handleTaskUpdated = () => {
    setShowEditForm(false);
    fetchTasks();
  };

  const handleTaskDeleted = () => {
    setShowDeleteConfirm(false);
    fetchTasks();
  };

  const toggleDescription = () => {
    setDescriptionExpanded(!descriptionExpanded);
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
        
        <p 
          ref={descriptionRef}
          className={`task-description ${descriptionExpanded ? "expanded" : ""}`}
        >
          {task.description}
        </p>
        
        {showReadMore && (
          <button 
            className="read-more-btn" 
            onClick={toggleDescription}
          >
            {descriptionExpanded ? "Daha Az Göster" : "Daha Fazla Göster"}
          </button>
        )}
        
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
          task={task}
          onSave={handleTaskUpdated}
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