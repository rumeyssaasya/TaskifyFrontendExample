import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskCard from "../TaskCard/taskCard";
import CreateTask from "../CreateTask/createTask";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  // Backend'den gelen task objesinde proje bilgisi genelde nested obje olarak geliyor
  project: number | null;
}

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface ProjectDetailProps {
  projectId: number; // Bu component hangi proje için çalışacaksa onun id'si dışarıdan gelir
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  // Proje detaylarını tutan state
  const [project, setProject] = useState<Project | null>(null);

  // O projeye ait veya tüm görevlerin tutulduğu state
  const [tasks, setTasks] = useState<Task[]>([]);

  // Görev ekleme formunun gösterilip gösterilmeyeceğini kontrol eden state
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  // Component mount olduğunda veya projectId değiştiğinde veri çekme işlemi yapılır
  useEffect(() => {
    if (!projectId) return; // projectId yoksa API çağrısı yapma

    const fetchProjectAndTasks = async () => {
      try {
        // Proje bilgisi ve tüm görevler paralel olarak çekiliyor
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${projectId}`), // Tek bir proje bilgisi
          api.get(`/tasks`),                 // Tüm görevler
        ]);
        setProject(projectRes.data); // Proje state'ine set et
        setTasks(tasksRes.data);     // Tüm görevleri state'e koy
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

  // tasks dizisinden sadece bu proje altındaki görevleri filtreliyoruz
  // Backend'de task nesnesi içinde project bilgisi objesi olarak geliyor (task.project.id)
  const filteredTasks = tasks.filter((task) => task.project?.id === projectId);

  // Tarihleri okunabilir Türkçe formatta göstermek için format fonksiyonu
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR");
  };

  // Yeni görev oluşturulduğunda çağrılan fonksiyon
  // Hem formu kapatıyor, hem de yeni gelen görevi mevcut listeye ekliyor
  // Böylece sayfa yeniden yüklenmeden güncel görev listesi gösteriliyor
  const handleTaskCreated = (newTask: Task) => {
    setShowCreateTaskForm(false); // Formu gizle
    setTasks((prev) => [...prev, newTask]); // Yeni görevi mevcut görevler listesine ekle
  };

  return (
    <div style={{ padding: 24, position: "relative" }}>
      {project && (
        <>
          {/* Proje başlığı, açıklaması ve tarihleri gösteriliyor */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: "bold" }}>{project.name}</h1>
            <p style={{ fontSize: 16, color: "#555", marginTop: 4 }}>
              {project.description}
            </p>
            <p style={{ fontSize: 14, color: "#777", marginTop: 8 }}>
              Başlangıç: {formatDate(project.startDate)} - Bitiş: {formatDate(project.endDate)}
            </p>
          </div>

          {/* Görev ekleme formunu açıp kapatmaya yarayan buton */}
          <button
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: "8px 12px",
              backgroundColor: showCreateTaskForm ? "#dc3545" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
            }}
            onClick={() => setShowCreateTaskForm((prev) => !prev)} // Toggle işlemi
          >
            {showCreateTaskForm ? "Kapat" : "Görev Ekle"}
          </button>

          {/* Görev oluşturma formu sadece showCreateTaskForm true ise gösterilir */}
          {showCreateTaskForm && (
            <div style={{ marginBottom: 24 }}>
              {/* Burada CreateTask bileşenine proje id'si gönderiliyor */}
              {/* onTaskCreated callback fonksiyonu ile görev oluşturulduğunda parent bilgilendiriliyor */}
              <CreateTask projectId={projectId} onTaskCreated={function (newTask: Task): void {
                throw new Error("Function not implemented.");
              } } />
            </div>
          )}

          {/* Görevler listesi */}
          <div>
            {filteredTasks.length === 0 ? (
              <p style={{ color: "#999" }}>Bu projeye ait görev bulunmamaktadır.</p>
            ) : (
              // Filtrelenmiş görevler map ile listeleniyor
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
