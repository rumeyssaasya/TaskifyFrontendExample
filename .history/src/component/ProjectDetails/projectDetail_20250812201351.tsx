import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskCard from "../TaskCard/taskCard";
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Başlangıç kart görünümü

  useEffect(() => {
    if (!projectId) return;

    fetchProjectAndTasks();
  }, [projectId]);

  // Proje ve görevleri fetch eden fonksiyon
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR");
  };

  const fetchTasks = async () => {
    try {
      const tasksRes = await api.get(`/projects/${projectId}/tasks`);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Görevler alınamadı:", error);
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

  return (
    <div className="project-detail">
      {project && (
        <>
          <div className="project-header">
            <div className="project-header-content">
              <h1 className="project-title">{project.projectName}</h1>
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

            <div className="project-header-actions">
              <button
                className={`add-task-btn ${showCreateTaskForm ? "close" : ""}`}
                onClick={toggleCreateTaskForm}
                title={
                  showCreateTaskForm
                    ? "Görev Ekleme Formunu Kapat"
                    : "Yeni Görev Ekle"
                }
              >
                {showCreateTaskForm ? "×" : "+"}
              </button>

              <button
                className={`add-member-toggle-btn ${
                  showMemberForm ? "active" : ""
                }`}
                onClick={toggleMemberForm}
                title={
                  showMemberForm
                    ? "Ekip Üyesi Ekleme Formunu Kapat"
                    : "Ekip Üyesi Ekle"
                }
              >
                {showMemberForm ? "×" : "👥"}
              </button>

              {/* Görünüm değiştirme butonu */}
              <button
                className="view-toggle-btn"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                title={
                  viewMode === "grid"
                    ? "Liste görünümüne geç"
                    : "Kart görünümüne geç"
                }
              >
                {viewMode === "grid" ? "📋" : "🟦"}
              </button>
            </div>
          </div>

          {/* Ekip ekleme formu */}
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

          {/* Görev ekleme formu */}
          {showCreateTaskForm && (
            <div className="create-task-container">
              <CreateTask
                projectId={projectId}
                onTaskCreated={handleTaskCreated}
              />
            </div>
          )}

          {/* Task listesi */}
          <div className="tasks-container">
            {tasks.length === 0 ? (
              <p className="no-tasks">Bu projeye ait görev bulunmamaktadır.</p>
            ) : (
              <div className={viewMode === "grid" ? "tasks-grid" : "tasks-list"}>
                {tasks.map((task) => (
                  <div key={task.id} className={`task-item ${viewMode}`}>
                    <TaskCard
                      task={task}
                      fetchTasks={fetchTasks}
                      viewMode={viewMode}
                    />
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
