import React, { useState } from "react";
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
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  project = null, 
  tasks = [], 
  fetchTasks,
  onDragStart
}) => {
  // ... Diğer state'ler aynı kalıyor ...

  return (
    <div className="task-list-container">
      {/* ... Diğer JSX ... */}
      
      <div className="tasks-wrapper">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="task-card"
            draggable
            onDragStart={(e) => onDragStart?.(e, task)}
          >
            {/* ... Görev kartı içeriği ... */}
          </div>
        ))}
      </div>

      {/* ... Edit/Delete modal'ları ... */}
    </div>
  );
};

export default TaskList;