import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  
  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Görevler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [...prev, newTask]); // yeni task'ı listeye ekle
  };

  return (
    <div>
      <Navbar />
      <CreateTask projectId={null} onTaskCreated={handleTaskCreated} />
      <TaskList tasks={tasks} project={null} />
    </div>
  );
};

export default Tasks;
