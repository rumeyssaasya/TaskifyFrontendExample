// src/pages/Projects.tsx
import React, { useEffect, useState, useMemo } from "react"; // useMemo eklendi
import api from "../../api/axios";
import Navbar from "../../component/Navbar/navbar";
import ProjectList from "../../component/ProjectList/projectList";
import CreateProject from "../../component/CreateProject/createProject";
import ProjectDetail from "../../component/ProjectDetails/projectDetail";
import "./projects.css";
import type { Project } from "../../types"; // Proje tipi eklendi

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
  ); // 🆕 artık her render'da tekrar .find etmeyecek

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

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects((prev) => 
      prev.map((p) => p.id === updatedProject.id ? updatedProject : p)
    );
    // Eğer düzenlenen proje seçili projeyse, seçili projeyi güncelle
    if (selectedProjectId === updatedProject.id) {
      setSelectedProjectId(updatedProject.id);
    }
  };

  const handleProjectDeleted = (projectId: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    // Eğer silinen proje seçili projeyse, seçili projeyi temizle
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  const handleAddProjectClick = () => {
    setShowCreateForm((prev) => {
      const newShowCreateForm = !prev;
      if (newShowCreateForm) {
        // Form açılıyorsa seçili projeyi kapat
        setSelectedProjectId(null);
      } else {
        // Form kapanıyorsa, ilk projeyi seç (varsa)
        setSelectedProjectId(projects[0]?.id ?? null);
      }
      return newShowCreateForm;
    });
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  console.log("selectedProject", selectedProject);
  console.log("collaborators", selectedProject?.collaborators);
  /* --------- RENDER --------- */
 return (
  <div className="projects-page">
    <Navbar /> {/* NAVBAR en üstte */}

    <div className="main-wrapper"> {/* Sidebar + Content beraber */}
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
          onProjectUpdated={handleProjectUpdated}
          onProjectDeleted={handleProjectDeleted}
        />
      </div>

      {/* TOGGLE BUTONU YİNE BURADA */}
      <button
        className={`sidebar-toggle-btn ${sidebarOpen ? "open" : "closed"}`}
        onClick={toggleSidebar}
        title={sidebarOpen ? "Sidebar'ı Kapat" : "Sidebar'ı Aç"}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>

      <div className="projects-content">
        <h1 className="page-title">
          {selectedProject?.projectName ?? "Proje Seçin"}
        </h1>
        {selectedProject?.collaborators?.length ? (
              <div className="collaborators">
                {selectedProject.collaborators.map((c, idx) => {
                  const username = typeof c === "string" ? c : c.username;
                  return (
                    <div key={idx} className="avatar" title={username}>
                      {username.charAt(0).toUpperCase()}
                    </div>
                  );
                })}
              </div>
            ) : null}
        <div className="content-body">
          {showCreateForm ? (
            <div className="create-project-main">
              <h2 className="create-project-main-title">Yeni Proje Oluştur</h2>
              <p className="create-project-main-subtitle">
                Yeni bir proje oluşturarak görevlerinizi organize edin
              </p>
              <CreateProject onProjectCreated={handleProjectCreated} />
            </div>
          ) : selectedProjectId ? (
            <ProjectDetail projectId={selectedProjectId} />
          ) : (
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
  </div>
);
};

export default Projects;
