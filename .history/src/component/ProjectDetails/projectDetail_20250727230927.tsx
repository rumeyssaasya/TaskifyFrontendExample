import React, { useEffect, useState } from "react";
import api from "../../api/axios";  // API isteklerini kolaylaştıran axios instance
import TaskCard from "../TaskCard/taskCard"; // Görev kartı bileşeni (dışarıdan)

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED"; // Görev durumu
  projectId: number;                            // Hangi projeye ait olduğu
}

interface Project {
  id: number;
  name: string;
  description: string;
}

interface ProjectDetailProps {
  projectId: number;   // Görüntülenecek projenin ID'si
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  // Proje bilgisi state’i
  const [project, setProject] = useState<Project | null>(null);

  // Projeye ait görevler listesi
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!projectId) return; // Eğer proje seçili değilse fetch yapma

    // Proje ve görevleri backend’den çek
    const fetchProjectAndTasks = async () => {
      try {
        // Proje detay ve tüm görevleri paralel çağır
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/tasks`),
        ]);
        setProject(projectRes.data);    // Proje bilgilerini state’e koy
        setTasks(tasksRes.data);        // Görev listesini state’e koy
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

  // Sadece bu projeye ait görevler filtrelenir
  const filteredTasks = tasks.filter((task) => task.projectId === projectId);

  // Görevleri durumlarına göre ayır
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
            {/* TO DO Kolonu */}
            <div>
              <h2 className="text-xl font-semibold mb-2">To Do</h2>
              <div className="space-y-2">
                {todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* IN PROGRESS Kolonu */}
            <div>
              <h2 className="text-xl font-semibold mb-2">In Progress</h2>
              <div className="space-y-2">
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* COMPLETED Kolonu */}
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
