import { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
import api from "../../api/axios";
import "./tasks.css";
import type { Task } from "../../types";

interface Column {
  id: number;
  title: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  tasks: Task[];
}

export default function Tasktsa() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  // Verileri çek
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Görevler alınırken hata oluştu:", error);
      }
    };
    fetchTasks();
  }, []);

  // Görevlere göre kolonları oluştur
  useEffect(() => {
    const groupedTasks: { [key in Column["status"]]: Task[] } = {
      TO_DO: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    tasks.forEach((task) => {
      groupedTasks[task.status].push(task);
    });

    const cols: Column[] = [
      { id: 1, title: "To Do", status: "TO_DO", tasks: groupedTasks.TO_DO },
      { id: 2, title: "In Progress", status: "IN_PROGRESS", tasks: groupedTasks.IN_PROGRESS },
      { id: 3, title: "Completed", status: "DONE", tasks: groupedTasks.DONE },
    ];

    setColumns(cols);
  }, [tasks]);

  // Görev eklendiğinde listeyi güncelle
  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="tasks-page">
      <Navbar />
      <div className="task-container">
        <CreateTask projectId={null} onTaskCreated={handleTaskCreated} />
        <div className="columns-wrapper">
          {columns.map((column) => (
            <TaskList
              key={column.id}
              column={column}
              allTasks={tasks}
              setTasks={setTasks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
