// src/pages/Projects.tsx
import React, { useEffect, useState, useMemo } from "react"; // 🆕 useMemo eklendi
import api from "../../api/axios";
import Navbar from "../../component/Navbar/navbar";
import ProjectList from "../../component/ProjectList/projectList";
import CreateProject from "../../component/CreateProject/createProject";
import ProjectDetail from "../../component/ProjectDetails/projectDetail";
import "./projects.css";

interface Project {
  id: number;
  projectName: string;          // Back‑end’den böyle geliyorsa bu isimle bırak
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* --------- DATA FETCH --------- */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get<Project[]>("/projects");
        setProjects(data);
      } catch (err) {
        console.error("Projeler yüklenemedi:", err);
      }
    };
    fetchProjects();
  }, []);

  /* --------- AUTO‑SELECT FIRST PROJECT --------- */
  useEffect(() => {
    if (projects.length && selectedProjectId === null && !showCreateForm) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, showCreateForm]);

  /* --------- MEMOIZED SELECTED PROJECT --------- */
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  ); // 🆕 artık her render’da tekrar .find etmeyecek

  /* --------- HANDLERS --------- */
  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    setShowCreateForm(false);
    setSelectedProjectId(newProject.id);
  };

  const handleProjectClick = (id: number) => {
    setSelectedProjectId(id);
    setShowCreateForm(false);
  };

  const handleAddProjectClick = () => {
    setShowCreateForm((prev) => !prev);
    if (showCreateForm) {
      setSelectedProjectId(projects[0]?.id ?? null);
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  /* --------- RENDER --------- */
  return (
    <div className="projects-page">
      {/* ---------- SIDE‑BAR ---------- */}
      <div className={`projects-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Projelerim</h2>
          <button
            className={`add-project-btn ${showCreateForm ? "active" : ""}`}
            onClick={handleAddProjectClick}
            title={showCreateForm ? "Formu Kapat" : "Yeni Proje Oluştur"}
          >
            +
          </button>
        </div>

        <ProjectList
          projects={projects}
          selectedProjectId={selectedProjectId}
          onDetailClick={handleProjectClick}
        />
      </div>

      {/* ---------- TOGGLE‑BUTTON ---------- */}
      <button
        className={`sidebar-toggle-btn ${sidebarOpen ? "open" : "closed"}`}
        onClick={toggleSidebar}
        title={sidebarOpen ? "Sidebar'ı Kapat" : "Sidebar'ı Aç"}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="projects-content">
        <div className="content-header">
          <Navbar />
          {/* 🆕 Başlık artık proje adını gösteriyor */}
          <h1 className="page-title">
            {selectedProject?.projectName ?? "Proje Seçin"}
          </h1>
        </div>

        <div className="content-body">
          {showCreateForm ? (
            /* ------- CREATE FORM ------- */
            <div className="create-project-main">
              <h2 className="create-project-main-title">Yeni Proje Oluştur</h2>
              <p className="create-project-main-subtitle">
                Yeni bir proje oluşturarak görevlerinizi organize edin
              </p>
              <CreateProject onProjectCreated={handleProjectCreated} />
            </div>
          ) : selectedProjectId ? (
            /* ------- PROJECT DETAIL ------- */
            <ProjectDetail projectId={selectedProjectId} />
          ) : (
            /* ------- EMPTY STATE ------- */
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">Proje Seçin</h3>
              <p className="empty-state-description">
                Sol taraftan bir proje seçerek görevlerinizi görüntüleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
