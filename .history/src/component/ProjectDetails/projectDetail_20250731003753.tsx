import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskCard from "../TaskCard/taskCard";
import CreateTask from "../CreateTask/createTask";
import "./projectDetail.css";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
}

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface ProjectDetailProps {
  projectId: number;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectAndTasks = async () => {
      try {
        setLoading(true);
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/projects/${projectId}/tasks`),
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR");
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    setShowCreateTaskForm(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const toggleCreateTaskForm = () => {
    setShowCreateTaskForm(!showCreateTaskForm);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!project) {
    return <div className="error">Proje bilgileri alınamadı.</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        <div className="project-header-content">
          <h1 className="project-title">{project.name}</h1>
          <p className="project-description">{project.description}</p>
          <div className="project-dates">
            <span className="project-date">
              Başlangıç: {formatDate(project.startDate)}
            </span>
            <span className="project-date">
              Bitiş: {formatDate(project.endDate)}
            </span>
          </div>
        </div>
        
        <button
          className={`add-task-btn ${showCreateTaskForm ? 'close' : ''}`}
          onClick={toggleCreateTaskForm}
          aria-label={showCreateTaskForm ? "Görev eklemeyi iptal et" : "Yeni görev ekle"}
        >
          {showCreateTaskForm ? "×" : "+"}
        </button>
      </div>

      {showCreateTaskForm && (
        <div className="create-task-container">
          <CreateTask 
            projectId={projectId} 
            onTaskCreated={handleTaskCreated} 
            onCancel={() => setShowCreateTaskForm(false)}
          />        
        </div>
      )}

      <div className="tasks-section">
        <h2 className="tasks-title">Görevler</h2>
        
        {tasks.length === 0 ? (
          <p className="no-tasks">Bu projeye ait görev bulunmamaktadır.</p>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id}
                task={task}
                fetchTasks={() => {
                  // Görev güncelleme için yeniden yükleme
                  api.get(`/projects/${projectId}/tasks`)
                    .then(res => setTasks(res.data))
                    .catch(err => console.error("Görevler yenilenemedi:", err));
                }}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;