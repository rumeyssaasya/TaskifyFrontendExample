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
  const [projects, setProjects] = useState<Project[]>([]);              // Tüm projeler
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null); // Seçili proje
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // Yeni proje formu görünümü

  // Sayfa ilk açıldığında projeleri getir
  useEffect(() => {
    fetchProjects();
  }, []);

  // Projeler geldiğinde eğer seçili proje yoksa ve form kapalıysa ilk projeyi seç
  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null && !showCreateForm) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, showCreateForm]);

  // Backend’den projeleri çek
  const fetchProjects = async () => {
    try {
      const response = await api.get<Project[]>("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Projeler yüklenemedi:", error);
    }
  };

  // Yeni proje oluşturulduğunda çağrılır
  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);  // Listeye ekle
    setShowCreateForm(false);                       // Formu kapat
    setSelectedProjectId(newProject.id);            // Yeni projeyi seç
  };

  // Proje listesinde tıklanırsa çalışır
  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowCreateForm(false); // Formu kapat
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Yan menü */}
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
        {/* Başlık ve + butonu */}
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
              setShowCreateForm((prev) => !prev); // Formu aç/kapat
              setSelectedProjectId(null);          // Seçili projeyi kaldır
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

        {/* Proje listesini göster */}
        <ProjectList projects={projects} onDetailClick={handleProjectClick} />
      </div>

      {/* Ana içerik */}
      <div style={{ flex: 1, background: "#fff", position: "relative" }}>
        <Navbar />
        <div style={{ padding: 24 }}>
          {showCreateForm ? (
            // Form gösteriliyorsa
            <CreateProject onProjectCreated={handleProjectCreated} />
          ) : selectedProjectId ? (
            // Proje seçildiyse detayını göster
            <ProjectDetail projectId={selectedProjectId} />
          ) : (
            // Hiç proje yoksa veya seçim yapılmadıysa mesaj göster
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
