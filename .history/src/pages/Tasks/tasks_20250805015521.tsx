import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";
import "./tasks.css";
import type {Task} from "../../types";

interface Column {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: Column[] = [
    { id: "todo", title: "Yapılacak", status: "TO_DO", tasks: [] },
    { id: "in-progress", title: "Yapılıyor", status: "IN_PROGRESS", tasks: [] },
    { id: "done", title: "Tamamlandı", status: "DONE", tasks: [] }
  ];

  const fetchTasks = async () => {
    try {
      const response = await api.get<Task[]>("/tasks");
      // Sadece projectId null olan görevleri filtrele
      const tasksWithoutProject = response.data.filter(task => task.projectId === null);
      setTasks(tasksWithoutProject);
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

  // Görevleri sütunlara dağıt
  const getColumnTasks = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  // Sürükle başlatma
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  // Sürükle bitirme
  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  // Sürükle üzerine gelme
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Bırakma
  const handleDrop = async (e: React.DragEvent, targetStatus: "TO_DO" | "IN_PROGRESS" | "DONE") => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === targetStatus) {
      return;
    }

    try {
      // API'ye güncelleme isteği gönder
      await api.put(`/tasks/${draggedTask.id}`, {
        ...draggedTask,
        status: targetStatus
      });

      // Local state'i güncelle
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, status: targetStatus }
            : task
        )
      );
    } catch (error) {
      console.error("Görev durumu güncellenemedi:", error);
    }
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

        <div className="kanban-board">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`kanban-column ${column.id}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status as "TO_DO" | "IN_PROGRESS" | "DONE")}
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
                        <button className="edit-task-btn" title="Düzenle">
                          ✏️
                        </button>
                        <button className="delete-task-btn" title="Sil">
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
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
