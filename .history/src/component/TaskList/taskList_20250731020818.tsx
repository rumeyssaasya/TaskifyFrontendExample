import React from "react";
import api from "../../api/axios";
import DeleteTask from "../DeleteTask/DeleteTask";
import type { Task } from "../../types";

interface TaskListProps {
  project: {
    id: number;
    name: string;
  } | null;
  tasks: Task[];
  fetchTasks?: () => void;
}

const statusLabels: Record<string, string> = {
  TO_DO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı",
};

const TaskList: React.FC<TaskListProps> = ({ project, tasks, fetchTasks }) => {
  const filteredTasks = tasks.filter(task =>
    project === null ? task.project === null : task.project?.id === project.id
  );

  const handleDelete = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks?.(); // Optional chaining ile güvenli çağırım
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  return (
    <div>
      <h2>Görevler</h2>
      {filteredTasks.length === 0 ? (
        <p>Görev bulunamadı.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTasks.map(task => (
            <li 
              key={task.id} 
              style={{
                marginBottom: '16px',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            >
              <div style={{ marginBottom: '8px' }}>
                <strong>{task.title}</strong>: {task.description}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Durum:</strong> {statusLabels[task.status] || "Bilinmiyor"}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                className="task-btn edit" 
                onClick={() => setShowEditForm(true)}
                aria-label="Görevi düzenle"
              >
                Düzenle
              </button>
              <button 
                  className="task-btn delete" 
                  onClick={() => setShowDeleteConfirm(true)}
                  aria-label="Görevi sil"
                >
                  Sil
                </button>
              </div>
              <span className="task-date">Bugün</span>
            </div>
          </div>

        {showEditForm && (
          <EditTask 
            task={task} // Tüm task bilgilerini gönderiyoruz
            onSave={(updatedTask) => {
              setShowEditForm(false);
              fetchTasks(); // Görev listesini yeniliyoruz
            }}
            onCancel={() => setShowEditForm(false)}
          />
        )}

        {showDeleteConfirm && (
          <DeleteTask 
            taskId={task.id}
            taskName={task.title}
            onDelete={handleTaskDeleted}
            onCancel={() => setShowDeleteConfirm(false)}
          />
  )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;