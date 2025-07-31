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
  // Seçili proje id'si
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Projeler yüklendiğinde ilk projeyi seçili yap
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
  };

  // Proje ismine tıklanınca çalışacak fonksiyon
  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div>
      <div style={{ display: "flex", height: "100vh" }}>
        <button onClick={() => <CreateProject onProjectCreated={handleProjectCreated} />}>
          Proje Oluştur
        </button>
      </div>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sol sidebar: Projelerim */}
        <div style={{ width: 250, background: "#f7f7f7", borderRight: "1px solid #e0e0e0", padding: 16, overflowY: "auto" }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Projelerim</h2>
          <ProjectList projects={projects} onDetailClick={handleProjectClick} />
        
        </div>
        {/* Ana içerik alanı */}
        <div style={{ flex: 1, position: "relative", background: "#fff" }}>
          <Navbar />
          <h1 style={{ margin: 24 }}>Taskify</h1>
          {/* Seçili projenin detayları */}
          {selectedProjectId && (
            <ProjectDetail projectId={selectedProjectId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
