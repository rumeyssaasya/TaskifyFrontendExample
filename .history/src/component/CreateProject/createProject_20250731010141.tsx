// src/pages/CreateProject.tsx
import React, { useState } from "react";
import api from "../../api/axios";
import "./createProject.css";
import type { Project } from "../../types";

interface CreateProjectProps {
  onProjectCreated: (newProject: Project) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TO_DO");
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
      console.log("Proje başarıyla oluşturuldu");
      
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
    <div className="create-project-container">
      <h3 className="create-project-title">Yeni Proje Oluştur</h3>
      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-group">
          <label className="form-label">Proje Adı</label>
          <input
            type="text"
            className="form-input"
            placeholder="Proje adını girin"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Açıklama</label>
          <textarea
            className="form-textarea"
            placeholder="Proje açıklaması"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Durum</label>
          <select 
            className="form-select"
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Başlangıç Tarihi</label>
            <input
              type="date"
              className="date-input"
              value={startDate ?? ""}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Bitiş Tarihi</label>
            <input
              type="date"
              className="date-input"
              value={endDate ?? ""}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        
        <button type="submit" className="create-project-btn">
          Proje Oluştur
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
