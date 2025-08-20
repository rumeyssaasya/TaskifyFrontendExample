import React from "react";
import TaskCard from "../TaskCard/taskCard";
import type { Task } from "../../types";

interface TaskListProps {
  tasks: Task[];
  fetchTasks: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, fetchTasks }) => {
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