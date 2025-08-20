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


const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [openProjectId, setOpenProjectId] = React.useState<number | null>(null);

  const toggleProject = (id: number) => {
    setOpenProjectId(openProjectId === id ? null : id);
  };

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          <h3 style={{ cursor: "pointer", color: "blue" }} onClick={() => toggleProject(project.id)}>
            {project.projectName}
          </h3>
          {openProjectId === project.id && (
            <div style={{ paddingLeft: "1rem" }}>
              <p><strong>Açıklama:</strong> {project.description}</p>
              <p><strong>Durum:</strong> {project.status || project.status}</p>
              <p><strong>Başlangıç Tarihi:</strong> {project.startDate}</p>
              <p><strong>Bitiş Tarihi:</strong> {project.endDate}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
export default ProjectList;
