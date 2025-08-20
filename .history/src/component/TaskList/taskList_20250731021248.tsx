import React, { useState } from "react";
import api from "../../api/axios";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";
import type { Task } from "../../types";

interface TaskListProps {
  project: {
    id: number;
    name: string;
  } | null;
  tasks: Task[];
  fetchTasks?: () => void;
}

const statusLabels = {
  TO_DO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı" // 'DONE' yerine 'COMPLETED' kullanıyoruz
};

const TaskList: React.FC<TaskListProps> = ({ project, tasks, fetchTasks }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task =>
    project === null ? task.projectId === null : task.projectId === project.id
  );

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks?.();
  };

  const handleTaskDeleted = () => {
    setDeletingTask(null);
    fetchTasks?.();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Tarih yok";
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="task-list-container">
      <h2>{project?.name || "Projeye Ait Olmayan Görevler"}</h2>
      
      {filteredTasks.length === 0 ? (
        <p className="no-tasks-message">Görev bulunamadı.</p>
      ) : (
        <ul className="task-items">
          {filteredTasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`task-status ${task.status.toLowerCase()}`}>
                    {statusLabels[task.status] || "Bilinmiyor"}
                  </span>
                  <span className="task-date">
                    {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="task-actions">
                <button 
                  className="edit-btn"
                  onClick={() => setEditingTask(task)}
                >
                  Düzenle
                </button>
                <button
                  className="delete-btn"
                  onClick={() => setDeletingTask(task)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <EditTask 
          task={editingTask}
          onSave={handleTaskUpdated}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deletingTask && (
        <DeleteTask 
          taskId={deletingTask.id}
          taskName={deletingTask.title}
          onDelete={handleTaskDeleted}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;