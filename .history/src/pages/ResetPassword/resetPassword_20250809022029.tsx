import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import './resetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get token from either URL params or query params
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Geçersiz veya eksik token');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/auth/reset-password', { 
        token, 
        newPassword: password 
      });
      
      setSuccess('Şifreniz başarıyla güncellendi!');
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err) {
      setError('Şifre sıfırlama başarısız. Lütfen bağlantıyı kontrol edip tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Şifre Yenileme</h1>
          <p className="login-subtitle">Yeni şifrenizi belirleyin</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label className="form-label">Yeni Şifre</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              placeholder="En az 6 karakter"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre Tekrarı</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              placeholder="Şifrenizi tekrar girin"
            />
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={isLoading || !password || !confirmPassword}
          >
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <a 
              href="/auth/login" 
              className="login-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/login');
              }}
            >
              Giriş sayfasına dön
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;