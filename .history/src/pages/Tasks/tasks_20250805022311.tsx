import { useState, useEffect } from "react";
import api from "../../api/axios";
import type { Task } from "../../types";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // API'den görevleri çek
  const fetchTasks = async () => {
    const res = await api.get<Task[]>("/tasks");
    setTasks(res.data.filter(task => !task.projectId));
  };

  // Status güncelleme (PUT)
  const updateStatus = async (taskId: number, newStatus: string) => {
    const originalTasks = [...tasks];
    
    try {
      // 1. Önce optimistik güncelle
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));

      // 2. API'ye PUT isteği gönder
      await api.put(`/tasks/${taskId}`, { 
        ...tasks.find(t => t.id === taskId),
        status: newStatus 
      });

      // 3. Başarılıysa verileri yenile (opsiyonel)
      await fetchTasks();
      
    } catch (err) {
      // Hata durumunda geri al
      setTasks(originalTasks);
      console.error("Güncelleme hatası:", err);
    }
  };

  // Sürükle-bırak handlers
  const handleDragStart = (task: Task) => setDraggedTask(task);
  const handleDrop = async (status: string) => {
    if (draggedTask && draggedTask.status !== status) {
      await updateStatus(draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="kanban-board">
      {['TO_DO', 'IN_PROGRESS', 'DONE'].map(status => (
        <div 
          key={status}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop(status)}
        >
          <h3>{{
            'TO_DO': 'Yapılacak',
            'IN_PROGRESS': 'Yapılıyor',
            'DONE': 'Tamamlandı'
          }[status]}</h3>

          {tasks
            .filter(task => task.status === status)
            .map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task)}
              >
                {task.title}
                <select
                  value={task.status}
                  onChange={e => updateStatus(task.id, e.target.value)}
                >
                  {['TO_DO', 'IN_PROGRESS', 'DONE'].map(s => (
                    <option key={s} value={s}>
                      {{
                        'TO_DO': 'Yapılacak',
                        'IN_PROGRESS': 'Yapılıyor',
                        'DONE': 'Tamamlandı'
                      }[s]}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};