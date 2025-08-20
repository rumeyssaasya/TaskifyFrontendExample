import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";
import "./tasks.css";
import type { Task } from "../../types";

interface Column {
  id: string;
  title: string;
  status: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns: Column[] = [
    { id: "todo", title: "Yapılacak", status: "TO_DO" },
    { id: "in-progress", title: "Yapılıyor", status: "IN_PROGRESS" },
    { id: "done", title: "Tamamlandı", status: "DONE" }
  ];

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get<Task[]>("/tasks");
      const tasksWithoutProject = response.data.filter(task => task.projectId === null);
      setTasks(tasksWithoutProject);
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

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => setDraggedTask(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === targetStatus) return;

    try {
      const updatedTask = { ...draggedTask, status: targetStatus };
      await api.put(`/tasks/${draggedTask.id}`, updatedTask);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggedTask.id ? updatedTask : task
        )
      );
    } catch (err) {
      console.error("Görev durumu güncellenemedi:", err);
      setError("Görev durumu güncellenirken hata oluştu");
    }
  };

  const getColumnTasks = (status: string) => {
    return tasks.filter(task => task.status === status);
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
            aria-label={showCreateTaskForm ? "Formu kapat" : "Yeni görev ekle"}
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

        <div className="kanban-board">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`kanban-column ${column.id}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="column-header">
                <h3 className="column-title">{column.title}</h3>
                <span className="task-count">{getColumnTasks(column.status).length}</span>
              </div>
              
              <div className="column-content">
                {getColumnTasks(column.status).map((task) => (
                  <div
                    key={task.id}
                    className={`task-card ${draggedTask?.id === task.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="task-header">
                      <h4 className="task-title">{task.title}</h4>
                      <div className="task-actions">
                        <button className="edit-task-btn" aria-label="Görevi düzenle">
                          ✏️
                        </button>
                        <button className="delete-task-btn" aria-label="Görevi sil">
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <span className={`task-status ${task.status.toLowerCase().replace('_', '-')}`}>
                      {task.status === 'TO_DO' ? 'Yapılacak' : 
                       task.status === 'IN_PROGRESS' ? 'Yapılıyor' : 'Tamamlandı'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;