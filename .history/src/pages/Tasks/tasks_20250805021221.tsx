import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList"; // TaskList import ediliyor
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";
import "./tasks.css";
import type { Task } from "../../types";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get<Task[]>("/tasks");
      // API'dan gelen tüm görevler
      setTasks(response.data); 
      setError(null);
    } catch (err) {
      console.error("Görevler alınamadı:", err);
      setError("Görevler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = async () => {
    setShowCreateTaskForm(false);
    await fetchTasks();
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <Navbar />
        <div className="tasks-title-section">
          <h1 className="tasks-title">Görevlerim</h1>
          <button
            className={`add-task-btn ${showCreateTaskForm ? 'close' : ''}`}
            onClick={() => setShowCreateTaskForm(!showCreateTaskForm)}
          >
            {showCreateTaskForm ? "×" : "+"}
          </button>
        </div>
      </div>

      <div className="tasks-content">
        {showCreateTaskForm && (
          <div className="create-task-container">
            <CreateTask projectId={null} onTaskCreated={handleTaskCreated} />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-indicator">Yükleniyor...</div>}

        {/* TaskList bileşeni ile proje atanmamış görevleri göster */}
        <TaskList 
          project={null} 
          tasks={tasks} 
          fetchTasks={fetchTasks} 
        />
      </div>
    </div>
  );
};

export default Tasks;