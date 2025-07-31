import React from "react";
import TaskCard from "../TaskCard/taskCard";
import type { Task,Project } from "../../types";

interface TaskListProps {
  projectID: number | null; // Proje ID'si, eğer proje ile ilişkili ise
  tasks: Task[];
  fetchTasks: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ projectID,tasks, fetchTasks }) => {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          fetchTasks={fetchTasks} // Bu prop'u ekliyoruz
        />
      ))}
    </div>
  );
};

export default TaskList;