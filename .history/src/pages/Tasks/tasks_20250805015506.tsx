import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";
import "./tasks.css";
import type { Task } from "../../types";

interface Column {
  id: number;
  title: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  tasks: Task[];
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columns: Column[] = [
    { id: "todo", title: "Yapılacak", status: "TO_DO", tasks: [] },
    { id: "in-progress", title: "Yapılıyor", status: "IN_PROGRESS", tasks: [] },
    { id: "done", title: "Tamamlandı", status: "DONE", tasks: [] }
  ];

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Task[]>("/tasks");
      const filteredTasks = response.data.filter(task => 
        task.projectId === null
      );
      setTasks(filteredTasks);
    } catch (err) {
      setError("Görevler yüklenirken bir hata oluştu");
      console.error("Görevler alınamadı:", err);
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
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: "TO_DO" | "IN_PROGRESS" | "DONE") => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === targetStatus) return;

    const originalStatus = draggedTask.status;
    
    try {
      // Optimistik güncelleme
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, status: targetStatus }
            : task
        )
      );

      // API güncellemesi
      await api.patch(`/tasks/${draggedTask.id}`, { 
        status: targetStatus 
      });
      
    } catch (err) {
      // Hata durumunda geri al
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, status: originalStatus }
            : task
        )
      );
      setError("Görev durumu güncellenemedi");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError("Görev silinemedi");
      console.error("Silme hatası:", err);
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <Navbar />
        <div className="tasks-title-section">
          <h1>Görevlerim</h1>
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
          <CreateTask 
            projectId={null} 
            onTaskCreated={handleTaskCreated}
          />
        )}

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-indicator">Yükleniyor...</div>}

        <div className="kanban-board">
          {columns.map(column => (
            <div
              key={column.id}
              className={`kanban-column ${column.id}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="column-header">
                <h3>{column.title}</h3>
                <span className="task-count">
                  {tasks.filter(t => t.status === column.status).length}
                </span>
              </div>
              
              <div className="column-content">
                {tasks
                  .filter(task => task.status === column.status)
                  .map(task => (
                    <div
                      key={task.id}
                      className="task-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                    >
                      <div className="task-header">
                        <h4>{task.title}</h4>
                      </div>
                      <p className="task-description">{task.description}</p>
                      <div className="task-footer">
                        <span className={`priority-badge ${task.status.toLowerCase()}`}>
                          {task.status}
                        </span>
                        <div className="task-actions">
                          <button className="edit-btn">✏️</button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
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