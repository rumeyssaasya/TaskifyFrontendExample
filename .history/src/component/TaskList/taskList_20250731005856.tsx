import type { Task } from "../../types"; // Aynı Task interface'ini import edin

interface TaskListProps {
  project: {
    id: number;
    name: string;
  } | null;
  tasks: Task[]; // types.ts'teki Task interface'ini kullanın
  fetchTasks?: () => void;
}

const statusLabels: Record<string, string> = {
  TO_DO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı",
};

const TaskList: React.FC<TaskListProps> = ({ project, tasks }) => {
  const filteredTasks = tasks.filter(task =>
    project === null ? task.project === null : task.project === project
  );

  return (
    <div>
      <h2>Görevler</h2>
      {filteredTasks.length === 0 ? (
        <p>Görev bulunamadı.</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>: {task.description}{" "}
              <p><strong>Durum:</strong> {statusLabels[task.status] || "Bilinmiyor"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
