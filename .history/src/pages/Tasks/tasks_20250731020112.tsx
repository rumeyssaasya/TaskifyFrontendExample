import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";
import "./tasks.css";
import type {Task} from "../../types";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await api.get<Task[]>("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Görevler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = async () => {
  setShowCreateTaskForm(false);
  await fetchTasks(); // Yeni görev oluşturulduktan hemen sonra güncel veriyi çek
};

  const toggleCreateTaskForm = () => {
    setShowCreateTaskForm(!showCreateTaskForm);
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <Navbar />
        <div className="tasks-title-section">
          <h1 className="tasks-title">Görevlerim</h1>
          <button
            className={`add-task-btn ${showCreateTaskForm ? 'close' : ''}`}
            onClick={toggleCreateTaskForm}
            title={showCreateTaskForm ? "Görev Ekleme Formunu Kapat" : "Yeni Görev Ekle"}
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

        <div className="tasks-list-container">
          <TaskList tasks={tasks} fetchTasks={function (): void {
            throw new Error("Function not implemented.");
          } } />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
