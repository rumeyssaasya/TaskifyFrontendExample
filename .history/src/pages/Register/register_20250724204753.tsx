import React, { useState } from "react";
import api from "../../api/axios"
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
      const response = await api.post("http://localhost:8080/auth/register", {
        email,
        fullName,
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/auth/login"); // sayfaya yönlendiriyoruz, API endpoint'e değil
    } catch (err) {
      setError("Kayıt işlemi başarısız. Lütfen bilgileri kontrol edin.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>E-mail:</label>
        <input
          type="email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label>İsim - Soyisim:</label>
        <input
          type="text"
          placeholder="Adınız Soyadınız"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          required
        />
      </div>

      <div>
        <label>Kullanıcı Adı:</label>
        <input
          type="text"
          placeholder="kullaniciadi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label>Şifre:</label>
        <input
          type="password"
          placeholder="Şifrenizi girin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Kayıt Ol</button>
    </form>
  );
};

export default RegisterForm;
