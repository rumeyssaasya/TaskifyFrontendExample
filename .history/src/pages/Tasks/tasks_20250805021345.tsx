import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";
import "./tasks.css";
import type { Task } from "../../types";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const statusColumns = [
    { id: "todo", title: "Yapılacak", status: "TO_DO" },
    { id: "in-progress", title: "Yapılıyor", status: "IN_PROGRESS" },
    { id: "done", title: "Tamamlandı", status: "DONE" }
  ];

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get<Task[]>("/tasks");
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

  // Sürükleme işlemleri
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (status: "TO_DO" | "IN_PROGRESS" | "DONE") => {
    if (!draggedTask || draggedTask.status === status) return;

    try {
      await api.put(`/tasks/${draggedTask.id}`, {
        ...draggedTask,
        status
      });
      await fetchTasks(); // Görevleri yeniden çek
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
      setError("Görev durumu değiştirilemedi");
    }
  };

  return (
    <div className="tasks-page">
      {/* ... Diğer JSX kodu aynı kalıyor ... */}
      
      <div className="kanban-view">
        {statusColumns.map(column => (
          <div 
            key={column.id}
            className="status-column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.status)}
          >
            <h3>{column.title}</h3>
            <TaskList
              project={null}
              tasks={tasks.filter(t => t.status === column.status)}
              fetchTasks={fetchTasks}
              onDragStart={handleDragStart}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;