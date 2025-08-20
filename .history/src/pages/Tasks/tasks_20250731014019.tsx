import React from "react";
import TaskCard from "../../component/TaskCard/taskCard";
import type { Task } from "../../types";

interface TaskListProps {
  project: any;
  tasks: Task[];
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
  fetchTasks: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  project, 
  tasks, 
  onTaskUpdated,
  onTaskDeleted,
  fetchTasks
}) => {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          fetchTasks={fetchTasks}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
};

export default TaskList;