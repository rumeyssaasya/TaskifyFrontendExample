import React from "react";
import type { Project } from "../../types";
import "./projectList.css";

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: number | null;
  onProjectClick: (id: number) => void;
  onEditClick: (project: Project) => void;
  onDeleteClick: (id: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProjectId,
  onProjectClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`project-item ${selectedProjectId === project.id ? "selected" : ""}`}
          onClick={() => onProjectClick(project.id)}
        >
          <span className="project-name">{project.projectName}</span>
          
          <div className="project-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="edit-btn"
              onClick={() => onEditClick(project)}
              title="Düzenle"
            >
              ✏️
            </button>
            <button
              className="delete-btn"
              onClick={() => onDeleteClick(project.id)}
              title="Sil"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;