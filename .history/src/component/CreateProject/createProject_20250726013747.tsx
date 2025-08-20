// src/pages/CreateProject.tsx
import React, { useState } from "react";
import api from "../../api/axios";

interface Project {
  id: number;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface CreateProjectProps {
  onProjectCreated: (newProject: Project) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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

      onProjectCreated(response.data);

      // Formu temizle
      setProjectName("");
      setDescription("");
      setStatus("");
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error("Proje oluşturulamadı:", error);
    }
  };

  return (
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
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      <input
        type="date"
        value={startDate ?? ""}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate ?? ""}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button type="submit">Oluştur</button>
    </form>
  );
};

export default CreateProject;
