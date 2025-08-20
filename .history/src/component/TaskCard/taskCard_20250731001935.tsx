import React from "react";
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
}

const statusLabels: Record<string, string> = {
  TO_DO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  COMPLETED: "Tamamlandı",
};

// Status'a göre CSS class belirler
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

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
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
          {showEditForm && (
            <EditTask
              task={task}               // Düzenlenecek tam görev nesnesi
              onSave={() => {
                fetchTasks();           // Görevleri tekrar getir, güncelle
                setShowEditForm(false); // Modalı kapat
              }}
              onCancel={() => setShowEditForm(false)} // Modalı kapat
            />
          )}
          <DeleteTask taskId={task.id} />
        </div>
        <span className="task-date">Bugün</span>
      </div>
    </div>
  );
};

export default TaskCard;
