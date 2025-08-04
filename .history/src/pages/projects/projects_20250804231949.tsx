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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProject = useMemo(() => (
    projects.find(project => project.id === selectedProjectId) || null
  ), [projects, selectedProjectId]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get<Project[]>('/projects');
        setProjects(response.data);
      } catch (err) {
        setError('Projeler yüklenirken bir hata oluştu.');
        console.error('Projeleri getirme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProjectClick = () => {
    setShowCreateForm(prev => !prev);
    setSelectedProjectId(null); // Reset selected project when creating new one
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowCreateForm(false); // Hide create form when viewing a project
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
    setShowCreateForm(false);
    setSelectedProjectId(newProject.id); // Select the newly created project
  };

  const handleProjectUpdated = (updatedProject: Project) => {
      setProjects(prev => 
        prev.map(p => p.id === updatedProject.id ? updatedProject : p)
      );
      // Sadece başarılı güncellemede kapat
      setEditingProject(null);
      setSelectedProjectId(updatedProject.id); // Güncellenmiş projeyi seçili yap
    };

   const handleProjectDeleted = (projectId: number) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    // Sadece başarılı silmede kapat
    setDeletingProjectId(null);
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const deletingProject = useMemo(() => {
    return projects.find(p => p.id === deletingProjectId) || null;}, [deletingProjectId, projects]);

  return (
    <div className="projects-page">
      <Navbar/>
      
      <div className="main-wrapper">
        <div className={`projects-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">Projelerim</h2>
            <button
              className={`add-project-btn ${showCreateForm ? "active" : ""}`}
              onClick={handleAddProjectClick}
              title={showCreateForm ? "Formu Kapat" : "Yeni Proje Oluştur"}
              aria-label={showCreateForm ? "Yeni proje formunu kapat" : "Yeni proje oluştur"}
            >
              +
            </button>
          </div>

          {loading && <div className="loading-message">Yükleniyor...</div>}
          {error && <div className="error-message">{error}</div>}

          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onDetailClick={handleProjectClick}
            onEditClick={setEditingProject}
            onDeleteClick={setDeletingProjectId}
          />
        </div>
           <button
        className={`sidebar-toggle-btn ${sidebarOpen ? "open" : "closed"}`}
        onClick={toggleSidebar}
        title={sidebarOpen ? "Sidebar'ı Kapat" : "Sidebar'ı Aç"}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>
        <div className="project-content">
          {showCreateForm ? (
            <CreateProject 
              onProjectCreated={handleProjectCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : selectedProject ? (
            <ProjectDetail 
              project={selectedProject}
              projectId={selectedProject.id}
            />
          ) : (
            <div className="empty-state">
              <h3>Bir proje seçin veya yeni proje oluşturun</h3>
            </div>
          )}
        </div>

        {/* Modal Components */}
        {editingProject !== null && (
          <EditProject
            project={editingProject}
            onSave={handleProjectUpdated}
            onCancel={() => setEditingProject(null)}
          />
        )}

        {deletingProjectId !== null && (
          <DeleteProject
            projectId={deletingProjectId}
            projectName={projects.find(p => p.id === deletingProjectId)?.projectName || ''}
            onDelete={handleProjectDeleted}
            onCancel={() => setDeletingProjectId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;