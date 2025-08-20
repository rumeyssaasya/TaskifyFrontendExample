import React, { useState } from "react";
import "./taskCard.css";
import EditTask from "../EditTask/EditTask";

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  };
  fetchTasks: () => void;
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
  const [showEditForm, setShowEditForm] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`"${task.title}" görevini silmek istediğinize emin misiniz?`)) {
      try {
        // API çağrısını burada yap, örnek:
        await fetch(`http://localhost:5000/api/tasks/${task.id}`, { method: "DELETE" });
        fetchTasks(); // Listeyi yenile
      } catch (error) {
        console.error("Görev silinemedi:", error);
        alert("Görev silinirken bir hata oluştu.");
      }
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-status ${getStatusClass(task.status)}`}>
          {statusLabels[task.status] || "Bilinmiyor"}
        </span>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-footer">
        <div className="task-actions">
          <button className="task-btn edit" onClick={() => setShowEditForm(true)}>
            Düzenle
          </button>
          <button className="task-btn delete" onClick={handleDelete}>
            Sil
          </button>
        </div>
        <span className="task-date">Bugün</span>
      </div>

      {showEditForm && (
        <EditTask
          task={task}
          onSave={() => {
            fetchTasks();
            setShowEditForm(false);
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;
