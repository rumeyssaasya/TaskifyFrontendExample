import React from "react";
import TaskCard from "../TaskCard/taskCard";
import type { Task } from "../../types";
import api from "../../api/axios";

interface TaskListProps {
  tasks: Task[];
  fetchTasks: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, fetchTasks }) => {
  const handleDelete = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className="task-item-with-actions">
          <TaskCard task={task} />
          <div className="task-actions">
            <button 
              className="edit-btn"
              onClick={() => console.log("Düzenle:", task.id)}
            >
              Düzenle
            </button>
            <button 
              className="delete-btn"
              onClick={() => handleDelete(task.id)}
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;