import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/register", {
        email,
        fullName,
        username,
        password,
      });

      // Backend'den token'ı al
      const token = response.data.token;

      // Token'ı localStorage'a kaydet
      localStorage.setItem("token", token);

      // Başarılı giriş sonrası yönlendirme
      navigate("/api/auth/login");
    } catch (err) {
      // Hata mesajını göster
      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>E-mail:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>İsim - Soyisim:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
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
    </form>
  );
};

export default LoginForm;
