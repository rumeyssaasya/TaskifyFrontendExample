// src/components/ProjectDetail.tsx

import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // API isteklerini yapan helper
import TaskCard from "../TaskCard/taskCard"; // Görev kartı bileşeni

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  projectId: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
}

interface ProjectDetailProps {
  projectId: number;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

useEffect(() => {
  if (!projectId) return; // projectId yoksa çağrı yapma

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Veriler alınamadı:", error);
    }
  };

  fetchProjectAndTasks();
}, [projectId]);

  // Sadece bu projeye ait görevler
  const filteredTasks = tasks.filter((task) => task.projectId === projectId);
  const todoTasks = filteredTasks.filter((task) => task.status === "TO_DO");
  const inProgressTasks = filteredTasks.filter((task) => task.status === "IN_PROGRESS");
  const completedTasks = filteredTasks.filter((task) => task.status === "COMPLETED");

  return (
    <div className="p-6">
      {project && (
        <>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-6">{project.description}</p>

          <div className="grid grid-cols-3 gap-4">
            {/* TO DO */}
            <div>
              <h2 className="text-xl font-semibold mb-2">To Do</h2>
              <div className="space-y-2">
                {todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* IN PROGRESS */}
            <div>
              <h2 className="text-xl font-semibold mb-2">In Progress</h2>
              <div className="space-y-2">
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* COMPLETED */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Completed</h2>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
