import React, { useState } from "react";

interface Project {
  id: number;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);

  const toggleDetails = (id: number) => {
    setOpenProjectId(openProjectId === id ? null : id);
  };

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id} style={{ marginBottom: "1rem" }}>
          <div
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => toggleDetails(project.id)}
          >
            {project.projectName}
          </div>
          {openProjectId === project.id && (
            <div style={{ paddingLeft: "1rem" }}>
              <p><strong>Açıklama:</strong> {project.description}</p>
              <p><strong>Durum:</strong> {project.status}</p>
              <p><strong>Başlangıç:</strong> {project.startDate}</p>
              <p><strong>Bitiş:</strong> {project.endDate}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
