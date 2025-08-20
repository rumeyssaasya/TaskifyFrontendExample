import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";
import type { Task } from "../../types";
import "./TaskList.css"; // CSS dosyasını import ediyoruz

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
  DONE: "Tamamlandı"
};

const TaskList: React.FC<TaskListProps> = ({ project, tasks, fetchTasks }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const filtered = tasks.filter(task => 
      project ? task.project?.id === project.id : !task.project?.id
    );
    setFilteredTasks(filtered);
  }, [tasks, project]);

  const handleTaskUpdated = (updatedTask: Task) => {
    setFilteredTasks(prevTasks =>
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setEditingTask(null);
    fetchTasks?.();
  };

  const handleTaskDeleted = (taskId: number) => {
    setFilteredTasks(prevTasks =>
      prevTasks.filter(task => task.id !== taskId)
    );
    setDeletingTask(null);
    fetchTasks?.();
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
              <h3 className="task-title">{task.title}</h3>
              <p className="task-description">{task.description}</p>
              <p className="task-status">Durum: {statusLabels[task.status] || task.status}</p>
              
              <div className="task-actions">
                <button 
                  onClick={() => setEditingTask(task)}
                  className="edit-button"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setDeletingTask(task)}
                  className="delete-button"
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
          onDelete={() => handleTaskDeleted(deletingTask.id)}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;