import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    projectId: number;
}

interface TaskListProps {
    projectId: number | null; // Hangi proje altında görev listelenecek
    tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks, projectId }) => {
  const [visibleTasks, setVisibleTasks] = useState<Record<number, boolean>>({});

  return (
    <div>
        <Navbar/>
      <h2>Tasks</h2>
      <ul>
        {tasks
        .filter(task => task.projectId === projectId)
        .map(task => (
            <li key={task.id}>
            <strong>{task.title}</strong>: {task.description} {task.completed ? "(Completed)" : ""}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;