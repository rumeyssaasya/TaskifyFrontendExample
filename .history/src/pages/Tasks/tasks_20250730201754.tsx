import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  project: number | null;
}



const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await api.get<Task[]>("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Görevler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = async () => {
    await fetchTasks(); // yeni görev oluşturulunca tekrar çek
  };

  return (
    <div>
      <Navbar />
      <CreateTask projectId={null} onTaskCreated={handleTaskCreated} />
      <TaskList project={null} tasks={tasks} />
    </div>
  );
};

export default Tasks;
