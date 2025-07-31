import React, { useState } from "react";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  projectId: number;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleEditSave = () => {
    setShowEdit(false);
    window.location.reload(); // Basit çözüm: değişikliği anında görmek için
  };

  const handleDeleteConfirm = () => {
    setShowDelete(false);
    window.location.reload(); // Aynı şekilde silme sonrası güncelle
  };

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-actions">
        <button className="task-btn edit" onClick={() => setShowEdit(true)}>Düzenle</button>
        <button className="task-btn delete" onClick={() => setShowDelete(true)}>Sil</button>
      </div>

      {/* Modal bileşenlerini koşullu göster */}
      {showEdit && (
        <EditTask
          taskId={task.id.toString()}
          initialTitle={task.title}
          initialDescription={task.description}
          onSave={handleEditSave}
          onCancel={() => setShowEdit(false)}
        />
      )}

      {showDelete && (
        <DeleteTask
          taskId={task.id.toString()}
          taskName={task.title}
          onDelete={handleDeleteConfirm}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;
