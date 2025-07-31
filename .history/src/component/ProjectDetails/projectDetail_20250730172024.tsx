import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskCard from "../TaskCard/taskCard";
import CreateTask from "../CreateTask/createTask";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  project: {
    id: number;
    name?: string;
  } | null;
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
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  // Proje ve görevleri getir
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

  // Sadece bu proje altındaki görevler
  const filteredTasks = tasks.filter((task) => task.project?.id === projectId);

  // Yeni görev oluşturulduğunda listeye ekle
  const handleTaskCreated = (newTask: Task) => {
    setShowCreateTaskForm(false);
    setTasks((prev) => [...prev, newTask]); // Mevcut görevlere ekle anında görünür
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR");
  };

  return (
    <div style={{ padding: 24, position: "relative" }}>
      {project && (
        <>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: "bold" }}>{project.name}</h1>
            <p style={{ fontSize: 16, color: "#555", marginTop: 4 }}>
              {project.description}
            </p>
            <p style={{ fontSize: 14, color: "#777", marginTop: 8 }}>
              Başlangıç: {formatDate(project.startDate)} - Bitiş: {formatDate(project.endDate)}
            </p>
          </div>

          <button
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: "8px 12px",
              backgroundColor: showCreateTaskForm ? "#dc3545" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
            }}
            onClick={() => setShowCreateTaskForm((prev) => !prev)}
          >
            {showCreateTaskForm ? "Kapat" : "Görev Ekle"}
          </button>

          {showCreateTaskForm && (
            <div style={{ marginBottom: 24 }}>
              {/* projectId kesinlikle burada gönderiliyor */}
              <CreateTask projectId={projectId}  onTaskCreated={handleTaskCreated} />
            </div>
          )}

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
