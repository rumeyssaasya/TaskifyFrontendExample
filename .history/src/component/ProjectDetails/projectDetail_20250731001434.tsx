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

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectAndTasks = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/projects/${projectId}/tasks`),
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR");
  };

  const handleTaskCreated = (newTask: Task) => {
    setShowCreateTaskForm(false);
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleCreateTaskForm = () => {
    setShowCreateTaskForm(!showCreateTaskForm);
  };

  return (
    <div className="project-detail">
      {project && (
        <>
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
              title={showCreateTaskForm ? "Görev Ekleme Formunu Kapat" : "Yeni Görev Ekle"}
            >
              {showCreateTaskForm ? "×" : "+"}
            </button>
          </div>

          {showCreateTaskForm && (
            <div className="create-task-container">
              <CreateTask projectId={projectId} onTaskCreated={handleTaskCreated} />        
            </div>
          )}

          <div className="tasks-container">
            {tasks.length === 0 ? (
              <p className="no-tasks">Bu projeye ait görev bulunmamaktadır.</p>
            ) : (
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
