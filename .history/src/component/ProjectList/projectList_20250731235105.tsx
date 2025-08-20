import React from "react";
import type { Project } from "../../types";
import "./projectList.css";

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: number | null;
  onSelectProject: (id: number) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onEditProject,
  onDeleteProject
}) => {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`project-item ${selectedProjectId === project.id ? "selected" : ""}`}
          onClick={() => onSelectProject(project.id)}
        >
          <span className="project-name">{project.projectName}</span>
          
          <div className="project-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="edit-btn"
              onClick={() => onEditProject(project)}
              title="Düzenle"
            >
              ✏
            </button>
            <button
              className="delete-btn"
              onClick={() => onDeleteProject(project.id)}
              title="Sil"
            >
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;