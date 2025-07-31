import React from "react";
import TaskCard from "../../component/TaskCard/taskCard";
import type { Task } from "../../types";

interface TaskListProps {
  project: any;
  tasks: Task[];
  fetchTasks: () => void; // Sadece fetchTasks prop'unu tutuyoruz
}

const TaskList: React.FC<TaskListProps> = ({  
  tasks, 
  fetchTasks // Diğer prop'ları kaldırdık
}) => {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          fetchTasks={fetchTasks} // Sadece fetchTasks'i geçiriyoruz
        />
      ))}
    </div>
  );
};

export default TaskList;