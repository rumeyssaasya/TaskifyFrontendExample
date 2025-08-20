import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import Navbar from "../../component/Navbar/navbar";
import ProjectList from "../../component/ProjectList/projectList";
import CreateProject from "../../component/CreateProject/createProject";
import ProjectDetail from "../../component/ProjectDetails/projectDetail";
import DeleteProject from "../../component/DeleteProject/DeleteProject";
import EditProject from "../../component/EditProject/EditProject";
import "./projects.css";
import type { Project } from "../../types";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);

  // Projeleri yükle
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

  // İlk projeyi otomatik seç
  useEffect(() => {
    if (projects.length && selectedProjectId === null && !showCreateForm) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, showCreateForm]);

  // Seçili projeyi memoize et
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  // Yeni proje oluşturma handler'ı
  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    setShowCreateForm(false);
    setSelectedProjectId(newProject.id);
  };

  // Proje düzenleme handler'ı
  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    setEditingProject(null);
    if (selectedProjectId === updatedProject.id) {
      setSelectedProjectId(updatedProject.id); // Detail'i refresh etmek için
    }
  };

  // Proje silme handler'ı
  const handleProjectDeleted = (projectId: number) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setDeletingProjectId(null);
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  return (
    <div className="projects-page">
      <Navbar />
      
      <div className="main-wrapper">
        {/* Sidebar */}
        <div className={`projects-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">Projelerim</h2>
            <button
              className={`add-project-btn ${showCreateForm ? "active" : ""}`}
              onClick={() => setShowCreateForm(prev => !prev)}
              title={showCreateForm ? "Formu Kapat" : "Yeni Proje Oluştur"}
            >
              +
            </button>
          </div>

          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectClick={setSelectedProjectId}
            onEditClick={setEditingProject}
            onDeleteClick={setDeletingProjectId}
          />
        </div>

        {/* Sidebar Toggle */}
        <button
          className={`sidebar-toggle-btn ${sidebarOpen ? "open" : "closed"}`}
          onClick={() => setSidebarOpen(prev => !prev)}
          title={sidebarOpen ? "Sidebar'ı Kapat" : "Sidebar'ı Aç"}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>

        {/* Main Content */}
        <div className="projects-content">
          <h1 className="page-title">
            {selectedProject?.projectName ?? "Proje Seçin"}
          </h1>
          
          <div className="content-body">
            {showCreateForm ? (
              <div className="create-project-main">
                <h2 className="create-project-main-title">Yeni Proje Oluştur</h2>
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

      {/* Edit Modal */}
      {editingProject && (
        <EditProject
          project={editingProject}
          onSave={handleProjectUpdated}
          onCancel={() => setEditingProject(null)}
        />
      )}

      {/* Delete Modal */}
      {deletingProjectId && (
        <DeleteProject
          projectId={deletingProjectId}
          onDelete={handleProjectDeleted}
          onCancel={() => setDeletingProjectId(null)}
        />
      )}
    </div>
  );
};

export default Projects;