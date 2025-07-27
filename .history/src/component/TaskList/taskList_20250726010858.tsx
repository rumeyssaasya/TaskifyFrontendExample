import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  project: number | null; // proje ID ya da null
}

interface TaskListProps {
  project: number | null; // sadece ID veya null bekliyoruz
}

const TaskList: React.FC<TaskListProps> = ({ project }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Görevleri API'den çeker
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get<Task[]>("/tasks");
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError("Görevler yüklenirken hata oluştu");
      setLoading(false);
    }
  };

  // Bileşen yüklendiğinde görevleri getir
  useEffect(() => {
    fetchTasks();
  }, []);

  // Proje filtrelemesi: project null ise, sadece projeye bağlı olmayanlar; değilse ID eşleşenler
  const filteredTasks = tasks.filter(task =>
    project === null ? task.project === null : task.project === project
  );

  console.log("Filtreleme için gelen project:", project);
  console.log("Tüm görevler:", tasks);
  console.log("Filtrelenmiş görevler:", filteredTasks);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Görevler</h2>
      {filteredTasks.length === 0 ? (
        <p>Görev bulunamadı.</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>: {task.description}{" "}
              {task.completed ? "(Tamamlandı)" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
