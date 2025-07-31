import React from "react";
import TaskCard from "../TaskCard/taskCard";
import type { Task } from "../../types";

interface TaskListProps {
  projectID: number | null; // Filtreleme için proje ID'si
  tasks: Task[];
  fetchTasks: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ projectID, tasks, fetchTasks }) => {
  // Proje ID'sine göre filtreleme yapıyoruz
  const filteredTasks = projectID === null
    ? tasks.filter(task => task.projectId === null)
    : tasks.filter(task => task.projectId === projectID);

  return (
    <div className="task-list">
      {filteredTasks.length > 0 ? (
        filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            fetchTasks={fetchTasks}
          />
        ))
      ) : (
        <div className="no-tasks-message">
          {projectID === null
            ? "Projeye ait olmayan görev bulunmamaktadır."
            : "Bu projeye ait görev bulunmamaktadır."}
        </div>
      )}
    </div>
  );
};

export default TaskList;