import React from "react";

// Proje tip tanımı (burada interface ayırmadan yazdık)
interface Project {
  id: number;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface ProjectListProps {
  projects: Project[];                   // Listelenecek projeler
  onDetailClick: (projectId: number) => void; // Proje seçildiğinde çağrılacak callback
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onDetailClick }) => {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {projects.map((project) => (
        <li
          key={project.id}
          style={{
            padding: "10px 12px",
            cursor: "pointer",
            borderRadius: 6,
            marginBottom: 4,
            fontWeight: 500,
            fontSize: 16,
            transition: "background 0.2s",
            userSelect: "none"
          }}
          onClick={() => onDetailClick(project.id)}      // Tıklanınca seçilen proje ID'si gönderilir
          onMouseOver={e => (e.currentTarget.style.background = '#e3e9f6')} // Hover efekti
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          {project.projectName}  {/* Proje adı gösterilir */}
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
