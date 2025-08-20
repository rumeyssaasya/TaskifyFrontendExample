import React, { useState } from "react";
import "./taskCard.css";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  };
  fetchTasks: () => void;  // Üstten görevleri yenilemek için gelen fonksiyon
}

const statusLabels: Record<string, string> = {
  TO_DO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  COMPLETED: "Tamamlandı",
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "TO_DO":
      return "todo";
    case "IN_PROGRESS":
      return "in-progress";
    case "COMPLETED":
      return "completed";
    default:
      return "todo";
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, fetchTasks }) => {
  // Modal state'leri: Açık mı kapalı mı?
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div>
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className="task-status"> {getStatusClass(task.status)}
          {statusLabels[task.status] || "Bilinmiyor"}
        </span>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-footer">
        <div className="task-actions">
          <button className="task-btn edit" onClick={() => setShowEditForm(true)}>
            Düzenle
          </button>
          <button className="task-btn delete" onClick={() => setShowDeleteConfirm(true)}>
            Sil
          </button>
        </div>
        <span className="task-date">Bugün</span>
      </div> 
    </div>
    </div>
  );
};

export default TaskCard;