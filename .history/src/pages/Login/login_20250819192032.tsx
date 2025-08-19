import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
  const [isSendingMail, setIsSendingMail] = useState(false);
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
      navigate("/projects");
    } catch (err) {
      setError("Kullanıcı adı veya şifre hatalı!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingMail(true);
    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);

    try {
      await api.post("/auth/forgot-password", { email });
      setForgotPasswordSuccess("Şifre sıfırlama maili gönderildi!");
      setEmail("");
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setForgotPasswordSuccess(null);
      }, 3000);
    } catch (err: unknown) {
        if (err instanceof Error) {
          setForgotPasswordError(err.message);
        } else if (typeof err === "object" && err !== null && "response" in err) {
          // axios hatası varsa detaylı al
          const axiosError = err as any;
          setForgotPasswordError(axiosError.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
        } else {
          setForgotPasswordError("Bilinmeyen bir hata oluştu.");
        }
      }
     finally {
      setIsSendingMail(false);
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
              autoComplete="username"
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
              autoComplete="current-password"
              disabled={isLoading}
            />
            <div className="forgot-password-container">
              <button 
                type="button"
                className="forgot-password-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPasswordModal(true);
                }}
                disabled={isLoading}
              >
                Şifremi Unuttum
              </button>
            </div>
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
              navigate("/auth/register");
            }}>
              Kayıt Ol
            </a>
          </p>
        </div>
      </div>

      {/* Şifremi Unuttum Modal */}
      {showForgotPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close-btn"
              onClick={() => {
                setShowForgotPasswordModal(false);
                setForgotPasswordError(null);
                setForgotPasswordSuccess(null);
              }}
            >
              &times;
            </button>
            
            <h2>Şifre Sıfırlama</h2>
            <p>Şifre sıfırlama linkini almak için kayıtlı email adresinizi girin.</p>
            
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="form-label">Email Adresi</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSendingMail}
                />
              </div>

              {forgotPasswordError && <div className="error-message">{forgotPasswordError}</div>}
              {forgotPasswordSuccess && <div className="success-message">{forgotPasswordSuccess}</div>}

              <button 
                type="submit" 
                className="modal-submit-btn"
                disabled={isSendingMail}
              >
                {isSendingMail ? "Gönderiliyor..." : "Gönder"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;