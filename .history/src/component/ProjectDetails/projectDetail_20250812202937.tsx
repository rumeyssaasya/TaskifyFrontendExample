import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskCard from "../TaskCard/taskCard";
import ProjectTaskList from "../ProjectTaskList/projectTaskList";  // TaskList bileşenini import ettik
import CreateTask from "../CreateTask/createTask";
import AddMember from "../AddMember/addMember";
import "./projectDetail.css";
import type { Task, Project } from "../../types";

interface ProjectDetailProps {
  projectId: number;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!projectId) return;

    fetchProjectAndTasks();
  }, [projectId]);

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

  const handleTaskCreated = (newTask: Task) => {
    setShowCreateTaskForm(false);
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleCreateTaskForm = () => {
    setShowCreateTaskForm(!showCreateTaskForm);
  };

  const toggleMemberForm = () => {
    setShowMemberForm(!showMemberForm);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  return (
    <div className="project-detail">
      {project && (
        <>
          <div className="project-header">
            <div className="project-header-content">
              <p className="project-description">{project.description}</p>
              <div className="project-dates">
                <span className="project-date">
                  Başlangıç: {new Date(project.startDate).toLocaleDateString("tr-TR")}
                </span>
                <span className="project-date">
                  Bitiş: {new Date(project.endDate).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>

            <div className="project-header-actions">
              <button
                className={`add-task-btn ${showCreateTaskForm ? "close" : ""}`}
                onClick={toggleCreateTaskForm}
                title={showCreateTaskForm ? "Görev Ekleme Formunu Kapat" : "Yeni Görev Ekle"}
              >
                {showCreateTaskForm ? "×" : "+"}
              </button>

              <button
                className={`add-member-toggle-btn ${showMemberForm ? "active" : ""}`}
                onClick={toggleMemberForm}
                title={showMemberForm ? "Ekip Üyesi Ekleme Formunu Kapat" : "Ekip Üyesi Ekle"}
              >
                {showMemberForm ? "×" : "👥"}
              </button>

              <button
                className="view-toggle-btn"
                onClick={toggleViewMode}
                title={viewMode === "grid" ? "Liste görünümüne geç" : "Kart görünümüne geç"}
              >
                {viewMode === "grid" ? "📋" : "🟦"}
              </button>
            </div>
          </div>

          {showMemberForm && (
            <div className="add-member-form-container">
              <AddMember
                projectId={projectId}
                onMemberAdded={() => {
                  fetchProjectAndTasks();
                  setShowMemberForm(false);
                }}
              />
            </div>
          )}

          {showCreateTaskForm && (
            <div className="create-task-container">
              <CreateTask projectId={projectId} onTaskCreated={handleTaskCreated} />
            </div>
          )}

          <div className="tasks-container">
            {tasks.length === 0 ? (
              <p className="no-tasks">Bu projeye ait görev bulunmamaktadır.</p>
            ) : viewMode === "grid" ? (
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <TaskCard task={task} fetchTasks={fetchProjectAndTasks} />
                  </div>
                ))}
              </div>
            ) : (
              <ProjectTaskList tasks={tasks} fetchTasks={fetchProjectAndTasks} project={{
                    id: project.id,
                    name: project.projectName,
                  }} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
