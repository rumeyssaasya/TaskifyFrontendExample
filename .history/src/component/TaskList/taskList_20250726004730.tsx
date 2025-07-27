import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";
import api from "../../api/axios";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  projectId: number | null;
}

interface TaskListProps {
  projectId: number | null;
}

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchTasks();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  const filteredTasks = tasks.filter(task => task.projectId === projectId);

  return (
    <div>
      <Navbar />
      <h2>Görevler</h2>
      {filteredTasks.length === 0 ? (
        <p>Görev bulunamadı.</p>
      ) : (
        <ul>
        console.log("projectId gelen:", projectId);
          {filteredTasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>: {task.description} {task.completed ? "(Tamamlandı)" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
