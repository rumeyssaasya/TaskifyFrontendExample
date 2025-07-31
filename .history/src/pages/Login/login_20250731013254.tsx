import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("Gelen Token:", token);
      navigate("/projects");
    } catch (err) {
      setError("Kullanıcı adı veya şifre hatalı!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Taskify'a Hoş Geldiniz</h1>
          <p className="login-subtitle">Projelerinizi ve görevlerinizi yönetin</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Hesabınız yok mu?{" "}
            <a href="/register" className="login-link" onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}>
              Kayıt Ol
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
