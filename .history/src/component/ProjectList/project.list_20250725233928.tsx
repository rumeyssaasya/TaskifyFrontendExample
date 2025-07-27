import CreateTask from "../../component/CreateTask/createTask";
import React, { useEffect, useState } from "react";

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
  const [visibleTasks, setVisibleTasks] = useState<Record<number, boolean>>({});

  const toggleCreateTask = (projectId: number) => {
    setVisibleTasks(prev => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <div>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{project.projectName}</h3>
            <p><strong>Tanımı:</strong> {project.description}</p>
            <p><strong>Durum:</strong> {project.status}</p>
            <p><strong>Başlangıç:</strong> {project.startDate}</p>
            <p><strong>Bitiş:</strong> {project.endDate}</p>
            <button onClick={() => toggleCreateTask(project.id)}>Yeni Görev</button>
            {visibleTasks[project.id] && <CreateTask projectId={project.id} />}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default ProjectList;
