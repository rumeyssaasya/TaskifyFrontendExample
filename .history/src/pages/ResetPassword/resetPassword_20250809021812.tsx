import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./resetPassword.css"; 

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!");
      setEmail("");
    } catch (err) {
      setError("Bir hata oluştu. Lütfen e-posta adresinizi kontrol edip tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Şifremi Unuttum</h1>
          <p className="login-subtitle">Şifre sıfırlama bağlantısı almak için e-posta adresinizi girin</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label className="form-label">E-posta Adresi</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="ornek@email.com"
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Hesabınızı hatırladınız mı?{" "}
            <a 
              href="/auth/login" 
              className="login-link" 
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/login");
              }}
            >
              Giriş Yap
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;