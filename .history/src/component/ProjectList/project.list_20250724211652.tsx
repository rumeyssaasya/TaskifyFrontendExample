import React, { useState } from "react";
import api from "../../api/axios";
import Navbar from "../Navbar/navbar"; 

const ProjectList = () => {
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
      console.error("Projeler Getirilemeedi:", error);
    }
  };
  return (
    <div>
        <Navbar />
        
    </div>  )
}

export default ProjectList