import React, { useState } from "react";
import api from "../../api/axios";
import Navbar from "../../component/Navbar/navbar"; 

const Projects = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
    await api.get("/projects");
      const token = localStorage.getItem("token");
      console.log("token:", token);
    } catch (error) {
      console.error("Proje oluşturulamadı Hata:", error);
    }
  };
function Task() {
  return (
    <div>
        <button>ProjeLerim</button>
        <button>Görevlerim</button>
        <button>Profil</button>
    </div>  )
}

export default Task