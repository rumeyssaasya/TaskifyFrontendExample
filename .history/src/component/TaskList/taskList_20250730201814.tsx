import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  project: number | null; // proje ID ya da null
}

interface TaskListProps {
  project: number | null;
  tasks: Task[]; // artık dışarıdan geliyor
}

const statusLabels: Record<string, string> = {
  TO_DO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı",
};

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
              <p><strong>Durum:</strong> {statusLabels[task.status] || "Bilinmiyor"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
