import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const projects = () => {

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Projeler</h1>
    </div>
  );
};

export default projects;
