import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskCard from "../TaskCard/taskCard";

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
  startDate: string;
  endDate: string;
}

interface ProjectDetailProps {
  projectId: number;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectAndTasks = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/tasks`),
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

  const filteredTasks = tasks.filter((task) => task.projectId === projectId);

  // Tarih formatlama (örneğin: 27.07.2025)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR");
  };

  return (
    <div style={{ padding: 24, position: "relative" }}>
      {project && (
        <>
          {/* Proje başlığı ve açıklama */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: "bold" }}>{project.name}</h1>
            <p style={{ fontSize: 16, color: "#555", marginTop: 4 }}>
              {project.description}
            </p>
            <p style={{ fontSize: 14, color: "#777", marginTop: 8 }}>
              Başlangıç: {formatDate(project.startDate)} - Bitiş: {formatDate(project.endDate)}
            </p>
          </div>

          {/* Görev ekleme/düzenleme butonu (sağ üst köşe) */}
          <button
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
            }}
            onClick={() => {
              // TODO: Görev ekleme/düzenleme formunu açacak fonksiyon
              alert("Görev ekleme/düzenleme açılacak!");
            }}
          >
            Görev Ekle/Düzenle
          </button>

          {/* Görevler listesi */}
          <div>
            {filteredTasks.length === 0 ? (
              <p style={{ color: "#999" }}>Bu projeye ait görev bulunmamaktadır.</p>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
