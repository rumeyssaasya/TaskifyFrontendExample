import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

  // Get token from query parameters
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. First validate passwords match
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    // 2. Then check token exists
    if (!token) {
      setError('Geçersiz veya eksik token. Lütfen şifre sıfırlama bağlantısını tekrar kullanın.');
      return;
    }

    // 3. Validate password length
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending request with token:', token); // Debug log
      
      const response = await api.post('/auth/reset-password', { 
        token, 
        newPassword: password 
      });
      
      console.log('Response:', response.data); // Debug log
      
      setSuccess('Şifreniz başarıyla güncellendi! Yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err: any) {
      console.error('Error resetting password:', err); // Debug log
      
      // Check different error cases
      if (err.response) {
        if (err.response.status === 400) {
          setError('Geçersiz veya süresi dolmuş token');
        } else if (err.response.status === 404) {
          setError('Kullanıcı bulunamadı');
        } else {
          setError(err.response.data?.message || 'Bir hata oluştu');
        }
      } else {
        setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
      }
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
          {token && <p className="token-info">Token alındı: {token.substring(0, 10)}...</p>}
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
              minLength={8}
              disabled={isLoading}
              placeholder="En az 8 karakter"
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