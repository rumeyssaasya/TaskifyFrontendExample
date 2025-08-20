import React, { useState, useEffect } from "react";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";
import type { Task } from "../../types";
import "./projectTaskList.css";

interface TaskListProps {
  project: {
    id: number;
    name: string;
  };
  tasks: Task[];
  fetchTasks?: () => void;
  onDragStart?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  project,
  tasks = [],
  fetchTasks,
  onDragStart,
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks?.();
  };

  const handleTaskDeleted = () => {
    setDeletingTask(null);
    fetchTasks?.();
  };

  // Drag event handlers (internal)
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, task: Task) => {
    // Transfer the task id as string for use in drop event
    event.dataTransfer.setData("text/plain", String(task.id));
    event.dataTransfer.effectAllowed = "move";
    onDragStart?.(task);  // call parent's callback if exists
  };

  return (
    <div className="task-list-container">
      <h2 className="task-list-title">{project.name}</h2>
      {filteredTasks.length === 0 ? (
        <p className="no-tasks-message">Görev bulunamadı.</p>
      ) : (
        <div className="tasks-wrapper">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="task-card"
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
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
