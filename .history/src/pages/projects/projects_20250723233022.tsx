import React, { useState } from "react";
import api from "../../api/axios"

const Projects = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/api/projects", {
        projectName,
        description,
        status,
        startDate,
        endDate,
      });
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <div>
      <h1>Projeler</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
    </div>
  );
};

export default Projects;
