import React, { useState } from 'react';
import api from '../../api/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './changePassword.css';

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
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

      <div className="form-group password-group">
        <label>Mevcut Şifre</label>
        <div className="password-input-wrapper">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowCurrentPassword(prev => !prev)}
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="form-group password-group">
        <label>Yeni Şifre</label>
        <div className="password-input-wrapper">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowNewPassword(prev => !prev)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="form-group password-group">
        <label>Yeni Şifre (Tekrar)</label>
        <div className="password-input-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowConfirmPassword(prev => !prev)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {confirmPassword && !passwordsMatch && (
          <p className="password-error">Yeni şifreler eşleşmiyor</p>
        )}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
