import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../component/Navbar/navbar"; 
import ProjectList from "../../component/ProjectList/project.list";

interface Project {
  id: number;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Projeleri yükle (sayfa açılırken)
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get<Project[]>("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Projeler yüklenemedi:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post<Project>("/projects", {
        projectName,
        description,
        status,
        startDate,
        endDate,
      });

      // Yeni projeyi state'e ekle ki liste anlık güncellensin
      setProjects((prevProjects) => [...prevProjects, response.data]);

      // Formu temizle
      setProjectName("");
      setDescription("");
      setStatus("");
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error("Proje oluşturulamadı Hata:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Projeler</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <textarea
          placeholder="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate ?? ""}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate ?? ""}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button type="submit">Oluştur</button>
      </form>

      {/* Listeye projeleri prop olarak gönderiyoruz */}
      <ProjectList projects={projects} />
    </div>
  );
};

export default Projects;
