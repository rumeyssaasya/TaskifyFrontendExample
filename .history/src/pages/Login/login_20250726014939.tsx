import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      // Backend'den token'ı al
      const token = response.data.token;

      // Token'ı localStorage'a kaydet
      localStorage.setItem("token", token);
      console.log("Gelen Token:", token);
      // Başarılı giriş sonrası yönlendirme
      navigate("/projects");
    } catch (err) {
      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Kullanıcı Adı:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Şifre:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Giriş Yap</button>
      <button type="button" onClick={()=>navigate("/")}>Kayıt Ol</button>
    </form>
  );
};

export default LoginForm;
