import React, { useState } from "react";
import api from "../../api/axios";
import "./createTask.css";
import type { Task } from "../../types";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  projectId: number | null;
}

interface CreateTaskProps {
  projectId: number | null;
  onTaskCreated: (newTask: Task) => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ projectId, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TO_DO");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post<Task>("/tasks", {
        projectId,
        title,
        description,
        status,
      });
      onTaskCreated(response.data);
      console.log("Görev başarıyla oluşturuldu");

      setTitle("");
      setDescription("");
      setStatus("");

    } catch (error) {
      console.error("Görev oluşturulamadı Hata:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-task-form">
      <div className="form-group">
        <label className="form-label">Başlık</label>
        <input
          type="text"
          className="form-input"
          placeholder="Görev başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Açıklama</label>
        <textarea
          className="form-textarea"
          placeholder="Görev açıklaması"
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
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      
      <button type="submit" className="submit-btn">
        Görev Oluştur
      </button>
    </form>
  );
};

export default CreateTask;
