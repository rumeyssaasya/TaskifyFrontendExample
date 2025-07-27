import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Project {
  id: number;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]); // Projeleri burada tutacağız
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects"); // GET isteği
        setProjects(response.data); // Gelen veriyi state'e at
      } catch (error) {
        setError("Projeler getirilemedi.");
        console.error(error);
      }
    };

    fetchProjects(); // sayfa yüklendiğinde çalışır
  }, []);

  return (
    <div> 
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{project.projectName}</h3>
            <p><strong>Tanımı:</strong>{project.description}</p>
            <p><strong>Durum:</strong> {project.status}</p>
            <p><strong>Başlangıç:</strong> {project.startDate}</p>
            <p><strong>Bitiş:</strong> {project.endDate}</p>
            <button>Görev Ekle</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
