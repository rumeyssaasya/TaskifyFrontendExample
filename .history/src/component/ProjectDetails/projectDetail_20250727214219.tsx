// src/components/ProjectDetail.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios"; // API isteklerini yapan helper
import TaskCard from "./TaskCard";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
}

interface Project {
  id: number;
  name: string;
  description: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams(); // /projects/:projectId route'undan id'yi al
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!projectId) return;

    // Proje bilgilerini getir
    api.get(`/projects/${projectId}`).then((res) => {
      setProject(res.data);
    });

    // Görevleri getir
    api.get(`/projects/${projectId}/tasks`).then((res) => {
      setTasks(res.data);
    });
  }, [projectId]);

  const todoTasks = tasks.filter((task) => task.status === "TO_DO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

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
