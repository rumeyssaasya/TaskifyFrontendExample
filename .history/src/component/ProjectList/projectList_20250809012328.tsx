import React, { useState } from "react";
import "./projectList.css";
import type { Project } from "../../types"; // Proje tipi import edildi
import EditProject from "../EditProject/EditProject";
import DeleteProject from "../DeleteProject/DeleteProject";

interface ProjectListProps {
  projects: Project[];                   // Listelenecek projeler
  selectedProjectId: number | null;
  onDetailClick: (projectId: number) => void; // Proje seçildiğinde çağrılacak callback
  onProjectUpdated?: (updatedProject: Project) => void;
  onProjectDeleted?: (projectId: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  selectedProjectId, 
  onDetailClick,
  onProjectUpdated,
  onProjectDeleted
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleProjectUpdated = (updatedProject: Project) => {
    onProjectUpdated?.(updatedProject);
    setEditingProject(null);
  };

  const handleProjectDeleted = (projectId: number) => {
    onProjectDeleted?.(projectId);
    setDeletingProject(null);
  };

  // Proje durumuna göre CSS sınıfını döndüren fonksiyon
  const getStatusClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'status-active'; // Yeşil
      case 'pending':
        return 'status-pending'; // Sarı
      case 'completed':
        return 'status-completed'; // Mavi
      case 'on-hold':
        return 'status-on-hold'; // Kırmızı
      default:
        return 'status-default'; // Varsayılan
    }
  };

  return (
    <>
      <ul className="project-list">
        {projects.map((project) => {
          const isSelected = selectedProjectId === project.id;
          const statusClass = getStatusClass(project.status || '');
          
          return (
            <li
              key={project.id}
              className={`project-item ${isSelected ? 'selected' : ''} ${statusClass}`}
            >
              <div 
                className="project-content"
                onClick={() => onDetailClick(project.id)}      // Tıklanınca seçilen proje ID'si gönderilir
              >
                <span className="project-name">{project.projectName}</span>  {/* Proje adı gösterilir */}
                <span className="project-status">{project.status}</span> {/* Proje durumu gösterilir */}
              </div>
              <div className="project-actions">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(project);
                  }}
                  title="Projeyi Düzenle"
                >
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingProject(project);
                  }}
                  title="Projeyi Sil"
                >
                  🗑️
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {editingProject && (
        <EditProject
          project={editingProject}
          onSave={handleProjectUpdated}
          onCancel={() => setEditingProject(null)}
        />
      )}

      {deletingProject && (
        <DeleteProject
          project={deletingProject}
          onDelete={() => handleProjectDeleted(deletingProject.id)}
          onCancel={() => setDeletingProject(null)}
        />
      )}
    </>
  );
};

export default ProjectList;