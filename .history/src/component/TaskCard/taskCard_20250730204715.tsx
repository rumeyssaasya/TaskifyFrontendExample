// src/components/TaskCard.tsx

import React from "react";

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  };
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="bg-white shadow p-4 rounded-lg border hover:shadow-md transition-all">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-500">{task.description}</p>
      <p className="mt-2">
        <strong>Durum:</strong> {task.status}
      </p>
    </div>
  );
};

export default TaskCard;
