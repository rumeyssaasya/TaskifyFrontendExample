import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  project: number | null; // proje ID ya da null
}

interface TaskListProps {
  project: number | null;
  tasks: Task[]; // artık dışarıdan geliyor
}

const TaskList: React.FC<TaskListProps> = ({ project, tasks }) => {
  const filteredTasks = tasks.filter(task =>
    project === null ? task.project === null : task.project === project
  );

  return (
    <div>
      <h2>Görevler</h2>
      {filteredTasks.length === 0 ? (
        <p>Görev bulunamadı.</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>: {task.description}{" "}
              {task.completed ? "(Tamamlandı)" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
