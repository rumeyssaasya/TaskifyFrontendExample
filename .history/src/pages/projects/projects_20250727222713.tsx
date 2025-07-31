import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../component/Navbar/navbar";
import ProjectList from "../../component/ProjectList/projectList";
import CreateProject from "../../component/CreateProject/createProject";
import ProjectDetail from "../../component/ProjectDetails/projectDetail";

interface Project {
  id: number;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // 👈 Form aç/kapat kontrolü

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const fetchProjects = async () => {
    try {
      const response = await api.get<Project[]>("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Projeler yüklenemedi:", error);
    }
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    setShowCreateForm(false); // ✅ Formu kayıttan sonra kapat
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div>
      <div style={{ padding: 16 }}>
        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          {showCreateForm ? "Formu Kapat" : "Proje Oluştur"}
        </button>

        {showCreateForm && (
          <div style={{ marginTop: 16 }}>
            <CreateProject onProjectCreated={handleProjectCreated} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", height: "100%" }}>
        {/* Sol sidebar */}
        <div
          style={{
            width: 250,
            background: "#f7f7f7",
            borderRight: "1px solid #e0e0e0",
            padding: 16,
            overflowY: "auto",
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Projelerim</h2>
          <ProjectList projects={projects} onDetailClick={handleProjectClick} />
        </div>

        {/* Sağ içerik */}
        <div style={{ flex: 1, position: "relative", background: "#fff" }}>
          <Navbar />
          <h1 style={{ margin: 24 }}>Taskify</h1>
          {selectedProjectId && <ProjectDetail projectId={selectedProjectId} />}
        </div>
      </div>
    </div>
  );
};

export default Projects;
