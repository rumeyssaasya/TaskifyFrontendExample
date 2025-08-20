import React, { useState } from 'react';
import api from '../../api/axios';
import './changePassword.css';

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    setError('Yeni şifre ve onayı eşleşmiyor.');
    setSuccess('');
    return;
  }

  setIsLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await api.post(
      `profile/change-password?currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`
    );

    setSuccess(response.data || 'Şifre başarıyla değiştirildi.');
    setError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onSuccess();
  } catch (err: any) {
    setError(err.response?.data || 'Şifre değiştirme başarısız oldu.');
    setSuccess('');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form className="change-password-form" onSubmit={handleSubmit}>
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="form-group">
        <label>Mevcut Şifre</label>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Yeni Şifre</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Yeni Şifre (Tekrar)</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
