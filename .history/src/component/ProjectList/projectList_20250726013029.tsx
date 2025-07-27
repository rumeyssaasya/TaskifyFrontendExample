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

const statusLabels: Record<string, string> = {
  TODO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı",
};

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);

  const toggleProject = (id: number) => {
    setOpenProjectId(openProjectId === id ? null : id);
  };

  if (!projects.length) {
    return <p>Proje bulunamadı.</p>;
  }

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id} style={{ marginBottom: "1rem" }}>
          <h3
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => toggleProject(project.id)}
          >
            {project.projectName}
          </h3>
          {openProjectId === project.id && (
            <div style={{ paddingLeft: "1rem" }}>
              <p><strong>Açıklama:</strong> {project.description}</p>
              <p><strong>Durum:</strong> {statusLabels[project.status] || project.status}</p>
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
