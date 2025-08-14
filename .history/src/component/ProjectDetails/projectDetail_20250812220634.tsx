import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskCard from "../TaskCard/taskCard";
import ProjectTaskList from "../ProjectTaskList/projectTaskList";
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

  // Yeni: Paylaşma durumları
  const [shareUserName, setShareUserName] = useState<string>("");
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

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

  const toggleCreateTaskForm = () => setShowCreateTaskForm((prev) => !prev);
  const toggleMemberForm = () => setShowMemberForm((prev) => !prev);
  const toggleViewMode = () => setViewMode((prev) => (prev === "grid" ? "list" : "grid"));

  const handleShareProject = async () => {
    if (!shareUserName) return;
    setShareLoading(true);
    setShareError(null);
    setShareSuccess(false);

    try {
      const response = await api.post(`/projects/${projectId}/share`, null, {
        params: { userName: shareUserName },
      });
      setShareSuccess(true);
      setShareUserName("");
      console.log(response)
    } catch (error: any) {
      setShareError(error.response?.data || "Paylaşım başarısız oldu.");
    } finally {
      setShareLoading(false);
    }
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
                {viewMode === "grid" ? "📅" : "📃"}
              </button>
            </div>
          </div>

          {/* Ekip Üyesi Ekleme Formu */}
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

          {/* Görev Ekleme Formu */}
          {showCreateTaskForm && (
            <div className="create-task-container">
              <CreateTask projectId={projectId} onTaskCreated={handleTaskCreated} />
            </div>
          )}

          {/* Proje Paylaşma Bölümü */}
          <div className="project-share-section" style={{ margin: "1rem 0" }}>
            <input
              type="text"
              placeholder="Paylaşılacak Kullanıcı ID'si"
              value={shareUserName}
              onChange={(e) => setShareUserName(e.target.value)}
              disabled={shareLoading}
              style={{ padding: "0.5rem", marginRight: "0.5rem", width: "200px" }}
            />
            <button
              onClick={handleShareProject}
              disabled={shareLoading || !shareUserName.trim()}
              style={{ padding: "0.5rem 1rem" }}
            >
              {shareLoading ? "Paylaşılıyor..." : "Projeyi Paylaş"}
            </button>
            {shareError && <p style={{ color: "red", marginTop: "0.5rem" }}>{shareError}</p>}
            {shareSuccess && (
              <p style={{ color: "green", marginTop: "0.5rem" }}>Proje başarıyla paylaşıldı!</p>
            )}
          </div>

          {/* Görevler */}
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
              <div
                className="kanban-board"
                style={{ display: "flex", gap: "1rem" }}
              >
                {[
                  { status: "TO_DO", title: "Yapılacak" },
                  { status: "IN_PROGRESS", title: "Yapılıyor" },
                  { status: "COMPLETED", title: "Tamamlandı" },
                ].map(({ status, title }) => (
                  <div
                    key={status}
                    className="kanban-column"
                    style={{
                      flex: 1,
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "8px",
                      backgroundColor: "#f9f9f9",
                      minHeight: "300px",
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const taskId = e.dataTransfer.getData("text/plain");
                      if (!taskId) return;

                      const draggedTask = tasks.find(
                        (t) => String(t.id) === taskId
                      );
                      if (draggedTask && draggedTask.status !== status) {
                        api
                          .put(`/tasks/${draggedTask.id}`, {
                            ...draggedTask,
                            status,
                          })
                          .then(() => fetchProjectAndTasks())
                          .catch((err) =>
                            console.error("Durum güncellenemedi:", err)
                          );
                      }
                    }}
                  >
                    <h3>{title}</h3>
                    <ProjectTaskList
                      project={{ id: project.id, name: project.projectName }}
                      tasks={tasks.filter((task) => task.status === status)}
                      fetchTasks={fetchProjectAndTasks}
                      onDragStart={() => {}}
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
