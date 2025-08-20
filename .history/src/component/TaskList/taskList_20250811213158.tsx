import React, { useState } from "react";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";
import type { Task } from "../../types";
import "./TaskList.css";

interface TaskListProps {
  project?: { id: number; name: string } | null;
  tasks: Task[];
  fetchTasks?: () => void;
  onDragStart?: (task: Task) => void;
  onStatusChange?: (newStatus: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  project = null,
  tasks = [],
  fetchTasks,
  onDragStart,
  onStatusChange
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks?.();
  };

  const handleTaskDeleted = () => {
    setDeletingTask(null);
    fetchTasks?.();
  };

  return (
    <div className="task-list-container">
      <h2 className="task-list-title">{project?.name}</h2>

      {tasks.length === 0 ? (
        <p className="no-tasks-message">Görev bulunamadı.</p>
      ) : (
        <div className="tasks-wrapper">
          {tasks.map(task => (
            <div
              key={task.id}
              className="task-card"
              draggable
              onDragStart={() => onDragStart?.(task)}
            >
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div>
                  <p className="task-description">{task.description}</p>
                </div>
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
