import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

const projects = () => {
  return (
    <div>
      <h1>Projeler</h1>
    </div>
  );
};

export default projects;
