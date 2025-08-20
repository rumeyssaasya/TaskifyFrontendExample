import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";

// Define the Task type according to your API response structure
interface Task {
  id: number;
  title: string;
  description?: string;
  // Add other fields as needed
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

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]); // yeni task'ı listeye ekle
  };

  return (
    <div>
      <Navbar />
      <CreateTask projectId={null} onTaskCreated={handleTaskCreated} />
      <TaskList project={null} />
    </div>
  );
};

export default Tasks;
