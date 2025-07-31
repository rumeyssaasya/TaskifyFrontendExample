import React, { useState, useEffect } from "react";
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

const statusLabels = {
  TO_DO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı"
};

const TaskList: React.FC<TaskListProps> = ({ project, tasks, fetchTasks }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // tasks veya project değiştiğinde filtreleme yap
  useEffect(() => {
    const filtered = tasks.filter(task => 
      project ? task.project?.id === project.id : !task.project?.id
    );
    setFilteredTasks(filtered);
  }, [tasks, project]);

  const handleTaskUpdated = (updatedTask: Task) => {
    // Yerel state'i güncelle
    setFilteredTasks(prevTasks =>
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setEditingTask(null);
    // API'yi güncellemek için isteği yap
    fetchTasks?.();
  };

  const handleTaskDeleted = (taskId: number) => {
    // Yerel state'ten kaldır
    setFilteredTasks(prevTasks =>
      prevTasks.filter(task => task.id !== taskId)
    );
    setDeletingTask(null);
    // API'yi güncellemek için isteği yap
    fetchTasks?.();
  };

  return (
    <div>
      <h2>{project?.name || "Tüm Görevler"}</h2>
      
      {filteredTasks.length === 0 ? (
        <p>Görev bulunamadı.</p>
      ) : (
        <div>
          {filteredTasks.map(task => (
            <div key={task.id} style={{ 
              border: '1px solid #ddd', 
              padding: '10px', 
              marginBottom: '10px',
              borderRadius: '5px'
            }}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Durum: {statusLabels[task.status] || task.status}</p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={() => setEditingTask(task)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setDeletingTask(task)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTask && (
        <EditTask 
          task={editingTask}
          onSave={handleTaskUpdated}
          onCancel={() => setEditingTask(null)}
        />
      )}

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