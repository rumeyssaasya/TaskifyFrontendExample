import React, { useState } from "react";
import CreateTask from "../CreateTask/createTask"; 

interface Project {
  id: number;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

const statusLabels: Record<string, string> = {
  TODO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı",
};

const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);

  const toggleProject = (id: number) => {
    setOpenProjectId(openProjectId === id ? null : id);
  };

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          <h3
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => toggleProject(project.id)}
          >
            {project.projectName}
          </h3>
          {openProjectId === project.id && (
            <div style={{ paddingLeft: "1rem" }}>
              <p>
                <strong>Açıklama:</strong> {project.description}
              </p>
              <p>
                <strong>Durum:</strong> {statusLabels[project.status] || "Bilinmiyor"}
              </p>
              <p>
                <strong>Başlangıç Tarihi:</strong> {project.startDate}
              </p>
              <p>
                <strong>Bitiş Tarihi:</strong> {project.endDate}
              </p>

              <hr />
              <button type button></button>Yeni Görev Oluştur:
              <CreateTask projectId={project.id} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
