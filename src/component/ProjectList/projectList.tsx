import React, { useState } from "react";
import "./projectList.css";
import type { Project } from "../../types"; // Proje tipi import edildi
import EditProject from "../EditProject/EditProject";
import DeleteProject from "../DeleteProject/DeleteProject";

// Proje tip tanımı (burada interface ayırmadan yazdık)

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

  return (
    <>
      <ul className="project-list">
        {projects.map((project) => {
          const isSelected = selectedProjectId === project.id;
          return (
            <li
              key={project.id}
              className={`project-item ${isSelected ? 'selected' : ''}`}
            >
              <div 
                className="project-content"
                onClick={() => onDetailClick(project.id)}      // Tıklanınca seçilen proje ID'si gönderilir
              >
                <span className="project-name">{project.projectName}</span>  {/* Proje adı gösterilir */}
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
