import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./register.css";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const genderOptions = [
  { label: "Kadın", value: "FEMALE" },
  { label: "Erkek", value: "MALE" },
  { label: "Diğer", value: "OTHER" }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/register", {
        email,
        fullName,
        gender,
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/auth/login");
    } catch (err) {
      setError("Kayıt işlemi başarısız. Lütfen bilgileri kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Taskify'a Kayıt Ol</h1>
          <p className="register-subtitle">Hemen ücretsiz hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">İsim - Soyisim</label>
            <input
              type="text"
              className="form-input"
              placeholder="Adınız Soyadınız"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cinsiyet</label>
            <select 
              className="form-select"
              value={gender} // Burada state değeri olmalı
              onChange={(e) => setGender(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="" disabled>Seçiniz</option>
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-input"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-input"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? "Kayıt Oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Zaten hesabınız var mı?{" "}
            <a href="/auth/login" className="register-link" onClick={(e) => {
              e.preventDefault();
              navigate("/auth/login");
            }}>
              Giriş Yap
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
