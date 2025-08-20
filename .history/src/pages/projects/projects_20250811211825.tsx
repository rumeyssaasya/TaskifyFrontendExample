// src/pages/Projects.tsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import Navbar from "../../component/Navbar/navbar";
import ProjectList from "../../component/ProjectList/projectList";
import CreateProject from "../../component/CreateProject/createProject";
import ProjectDetail from "../../component/ProjectDetails/projectDetail";
import TaskList from "../../component/TaskList/taskList";
import "./projects.css";
import type { Project, Task } from "../../types";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showTaskList, setShowTaskList] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Görevleri çekme fonksiyonu
  const fetchTasks = () => {
  if (!selectedProjectId) return;
  console.log("Görevler çekiliyor, projeId:", selectedProjectId);
  api.get<Task[]>(`/projects/${selectedProjectId}/tasks`)
    .then(res => {
      console.log("Görevler alındı:", res.data);
      setTasks(res.data);
    })
    .catch(() => {
      console.log("Görevler alınamadı");
      setTasks([]);
    });
};

  /* --------- Projeleri yükle --------- */
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

  /* --------- Otomatik ilk projeyi seç --------- */
  useEffect(() => {
    if (projects.length && selectedProjectId === null && !showCreateForm) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, showCreateForm]);

  /* --------- Seçili projeyi hazırla --------- */
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  /* --------- Görevleri yükle (showTaskList ve seçili proje değişince) --------- */
  useEffect(() => {
    if (showTaskList && selectedProjectId) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [showTaskList, selectedProjectId]);

  /* --------- Proje oluşturma, seçme, güncelleme, silme --------- */
  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    setShowCreateForm(false);
    setSelectedProjectId(newProject.id);
    setShowTaskList(false);
  };

  const handleProjectClick = (id: number) => {
    setSelectedProjectId(id);
    setShowCreateForm(false);
    setShowTaskList(false);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    if (selectedProjectId === updatedProject.id) {
      setSelectedProjectId(updatedProject.id);
    }
  };

  const handleProjectDeleted = (projectId: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setShowTaskList(false);
    }
  };

  const handleAddProjectClick = () => {
    setShowCreateForm((prev) => {
      const newShowCreateForm = !prev;
      if (newShowCreateForm) {
        setSelectedProjectId(null);
        setShowTaskList(false);
      } else {
        setSelectedProjectId(projects[0]?.id ?? null);
      }
      return newShowCreateForm;
    });
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleTaskList = () => setShowTaskList((prev) => !prev);

  /* --------- Render --------- */
  return (
    <div className="projects-page">
      <Navbar />

      <div className="main-wrapper">
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

          <button onClick={toggleTaskList} disabled={!selectedProject}>
            {showTaskList ? "Proje Detayına Dön" : "Görevleri Göster"}
          </button>

          <div className="content-body">
            {showCreateForm ? (
              <div className="create-project-main">
                <h2 className="create-project-main-title">Yeni Proje Oluştur</h2>
                <p className="create-project-main-subtitle">
                  Yeni bir proje oluşturarak görevlerinizi organize edin
                </p>
                <CreateProject onProjectCreated={handleProjectCreated} />
              </div>
            ) : showTaskList && selectedProject ? (
              <TaskList
                project={{ id: selectedProject.id, name: selectedProject.projectName }}
                tasks={tasks}
                fetchTasks={fetchTasks}
              />
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
