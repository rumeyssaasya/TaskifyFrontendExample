import React, { useState } from "react";
import api from "../../api/axios";
import DeleteTask from "../DeleteTask/DeleteTask";
import EditTask from "../EditTask/EditTask";
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task =>
    project === null ? task.project === null : task.project?.id === project.id
  );

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks?.();
  };

  const handleTaskDeleted = () => {
    setDeletingTask(null);
    fetchTasks?.();
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
                borderRadius: '8px',
                position: 'relative'
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
                  onClick={() => setEditingTask(task)}
                  style={{
                    padding: '4px 8px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setDeletingTask(task)}
                  style={{
                    padding: '4px 8px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sil
                </button>
              </div>
              <span style={{
                position: 'absolute',
                right: '10px',
                bottom: '10px',
                fontSize: '0.8em',
                color: '#666'
              }}>
                {new Date(task.createdAt || new Date()).toLocaleDateString('tr-TR')}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <EditTask 
          task={editingTask}
          onSave={handleTaskUpdated}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deletingTask && (
        <DeleteTask 
          taskId={deletingTask.id}
          taskName={deletingTask.title}
          onDelete={handleTaskDeleted}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;