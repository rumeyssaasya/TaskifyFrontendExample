import React, { useState, useEffect } from "react";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";
import type { Task } from "../../types";
import "./TaskList.css";

interface TaskListProps {
  project?: {
    id: number;
    name: string;
  } | null;
  tasks: Task[];
  fetchTasks?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ project = null, tasks = [], fetchTasks }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const filtered = tasks.filter(task => 
      project ? task.project?.id === project.id : !task.project?.id
    );
    setFilteredTasks(filtered);
  }, [tasks, project]);

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks?.();
  };

  const handleTaskDeleted = () => {
    setDeletingTask(null);
    fetchTasks?.();
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'TO_DO': return 'Yapılacak';
      case 'IN_PROGRESS': return 'Yapılıyor';
      case 'DONE': return 'Tamamlandı';
      default: return status;
    }
  };

  return (
    <div className="task-list-container">
      <h2 className="task-list-title">{project?.name || "Tüm Görevler"}</h2>
      
      {filteredTasks.length === 0 ? (
        <p className="no-tasks-message">Görev bulunamadı.</p>
      ) : (
        <div className="tasks-wrapper">
          {filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`task-status ${task.status.toLowerCase().replace('_', '-')}`}>
                  {getStatusText(task.status)}
                </span>
              </div>
              <p className="task-description">{task.description}</p>
              
              <div className="task-actions">
                <button 
                  onClick={() => setEditingTask(task)}
                  className="edit-button"
                  aria-label="Görevi düzenle"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setDeletingTask(task)}
                  className="delete-button"
                  aria-label="Görevi sil"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTask && (
        <EditTask 
          task={editingTask}
          onSave={handleTaskUpdated}
          onCancel={() => setEditingTask(null)}
        />
      )}

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