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
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Proje listesi dolduğunda ve form kapalıysa otomatik seç
    if (projects.length > 0 && selectedProjectId === null && !showCreateForm) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, showCreateForm]);

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
    setShowCreateForm(false);
    setSelectedProjectId(newProject.id); // Yeni proje seçili olsun
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowCreateForm(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 280,
          background: "#f7f7f7",
          borderRight: "1px solid #ddd",
          padding: 16,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 22 }}>Projelerim</h2>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setSelectedProjectId(null);
            }}
            style={{
              fontSize: 24,
              fontWeight: "bold",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              lineHeight: 1,
              color: "#007bff",
            }}
            aria-label="Yeni Proje Oluştur"
          >
            +
          </button>
        </div>

        <ProjectList projects={projects} onDetailClick={handleProjectClick} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: "#fff", position: "relative" }}>
        <Navbar />
        <div style={{ padding: 24 }}>
          {showCreateForm ? (
            <CreateProject onProjectCreated={handleProjectCreated} />
          ) : selectedProjectId ? (
            <ProjectDetail projectId={selectedProjectId} />
          ) : (
            <div style={{ textAlign: "center", marginTop: 100, color: "#666" }}>
              <h3>Projeyi seç veya yeni proje oluştur</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
