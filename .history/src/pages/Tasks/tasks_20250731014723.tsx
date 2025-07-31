import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import CreateTask from "../../component/CreateTask/createTask";
import TaskCard from "../../component/TaskCard/taskCard";

const ProjectDetail = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Sayfa yüklendiğinde task'ları getir
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Görevler alınırken hata:", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  // Yeni task oluşturulduğunda listeye ekle
  const handleCreateTask = async (newTaskData) => {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, newTaskData);
      const createdTask = response.data;

      setTasks((prevTasks) => [...prevTasks, createdTask]); // Yeni task'ı state'e ekle
      setShowModal(false); // Modalı kapat
    } catch (error) {
      console.error("Görev oluşturulurken hata:", error);
    }
  };

  return (
    <div>
      <h2>Project Tasks</h2>
      <button onClick={() => setShowModal(true)}>Yeni Görev Ekle</button>

      {/* Task Listesi */}
      <div>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Modal */}
      <CreateTaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreateTask}
      />
    </div>
  );
};

export default ProjectDetail;
