import React from "react";
import "./projectList.css";
import type { Project } from "../../types"; // Proje tipi import edildi

// Proje tip tanımı (burada interface ayırmadan yazdık)

interface ProjectListProps {
  projects: Project[];                   // Listelenecek projeler
  selectedProjectId: number | null;
  onDetailClick: (projectId: number) => void; // Proje seçildiğinde çağrılacak callback
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, selectedProjectId, onDetailClick }) => {
  return (
    <ul className="project-list">
      {projects.map((project) => {
        const isSelected = selectedProjectId === project.id;
        return (
          <li
            key={project.id}
            className={`project-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onDetailClick(project.id)}      // Tıklanınca seçilen proje ID'si gönderilir
          >
            <span className="project-name">{project.projectName}</span>  {/* Proje adı gösterilir */}
          </li>
        );
      })}
    </ul>
  );
};

export default ProjectList;
