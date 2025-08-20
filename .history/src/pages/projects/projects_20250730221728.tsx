import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../component/Navbar/navbar";
import ProjectList from "../../component/ProjectList/projectList";
import CreateProject from "../../component/CreateProject/createProject";
import ProjectDetail from "../../component/ProjectDetails/projectDetail";
import "./projects.css";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
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
    setSelectedProjectId(newProject.id);
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowCreateForm(false);
  };

  const handleAddProjectClick = () => {
    setShowCreateForm(!showCreateForm);
    if (showCreateForm) {
      setSelectedProjectId(projects.length > 0 ? projects[0].id : null);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="projects-page">
      <div className={`projects-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-title-container">
            <h2 className="sidebar-title">Projelerim</h2>
          </div>
          <button 
            className={`add-project-btn ${showCreateForm ? 'active' : ''}`}
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
      
      <button 
        className={`sidebar-toggle-btn ${sidebarOpen ? 'open' : 'closed'}`}
        onClick={toggleSidebar}
        title={sidebarOpen ? "Sidebar'ı Kapat" : "Sidebar'ı Aç"}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>
      
      <div className="projects-content">
        <div className="content-header">
          <Navbar />
          <h1 className="page-title">{selectedProjectId}</h1>
        </div>
        
        <div className="content-body">
          {showCreateForm ? (
            <div className="create-project-main">
              <div className="create-project-main-header">
                <h2 className="create-project-main-title">Yeni Proje Oluştur</h2>
                <p className="create-project-main-subtitle">
                  Yeni bir proje oluşturarak görevlerinizi organize edin
                </p>
              </div>
              <CreateProject onProjectCreated={handleProjectCreated} />
            </div>
          ) : selectedProjectId ? (
            <ProjectDetail projectId={selectedProjectId} />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">Proje Seçin</h3>
              <p className="empty-state-description">
                Sol taraftan bir proje seçerek görevlerini görüntüleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
