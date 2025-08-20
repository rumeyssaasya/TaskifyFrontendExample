import React, { useState } from "react";
import api from "../../api/axios";

interface CreateTaskProps {
  projectId: number| null; // Hangi proje altında görev oluşturulacak
  onTaskCreated?: () => void; // Opsiyonel callback, görev oluşturulduğunda parent’ı bilgilendirmek için
}

const CreateTask: React.FC<CreateTaskProps> = ({ projectId, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/tasks", {
        projectId,     // burada proje id’sini gönderiyoruz
        title,
        description,
        completed,
      });

      console.log("Görev başarıyla oluşturuldu");

      // Formu temizle
      setTitle("");
      setDescription("");
      setCompleted(false);

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
