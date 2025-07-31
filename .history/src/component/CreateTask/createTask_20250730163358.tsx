import React, { useState } from "react";
import api from "../../api/axios";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  project: number | null; // Proje ID'si, eğer proje altında oluşturuluyorsa
}
interface CreateTaskProps {
  projectId: number| null; // Hangi proje altında görev oluşturulacak
  onTaskCreated: (newTask:Task) => void; // Opsiyonel callback, görev oluşturulduğunda parent’ı bilgilendirmek için
}

const CreateTask: React.FC<CreateTaskProps> = ({ projectId, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TO_DO");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/tasks", {
        projectId,     // burada proje id’sini gönderiyoruz
        title,
        description,
        status,
      });

      console.log("Görev başarıyla oluşturuldu");

      // Formu temizle
      setTitle("");
      setDescription("");
      setStatus("");

      // Parent’ı bilgilendir
      if (onTaskCreated) onTaskCreated();

    } catch (error) {
      console.error("Görev oluşturulamadı Hata:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="TO_DO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      <button type="submit">Görev Oluştur</button>
    </form>
  );
};

export default CreateTask;
