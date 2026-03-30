import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { changeCredentials } from '../../../services/api';
import styles from './AccountPanel.module.css';

export default function AccountPanel() {
  const { admin, logout } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [form, setForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Calculate password strength
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    setPasswordStrength(strength);
    return strength;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, newPassword: value });
    checkPasswordStrength(value);
  };

  const validateForm = () => {
    if (!form.currentPassword.trim()) {
      showToast('Current password is required', 'error');
      return false;
    }

    if (!form.newUsername.trim() && !form.newPassword.trim()) {
      showToast('Enter new username or password', 'error');
      return false;
    }

    if (form.newPassword) {
      if (form.newPassword.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return false;
      }
      if (!/[A-Z]/.test(form.newPassword)) {
        showToast('Password must have uppercase letter', 'error');
        return false;
      }
      if (!/[a-z]/.test(form.newPassword)) {
        showToast('Password must have lowercase letter', 'error');
        return false;
      }
      if (!/[0-9]/.test(form.newPassword)) {
        showToast('Password must have number', 'error');
        return false;
      }
      if (!/[!@#$%^&*]/.test(form.newPassword)) {
        showToast('Password must have special character (!@#$%^&*)', 'error');
        return false;
      }
      if (form.newPassword !== form.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      await changeCredentials({
        currentPassword: form.currentPassword,
        newUsername: form.newUsername || undefined,
        newPassword: form.newPassword || undefined,
      });

      showToast('Credentials updated! Please login again.', 'success');
      setTimeout(() => {
        logout();
        window.location.href = '/admin/login';
      }, 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update credentials', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <span className={styles.title}>Account Settings</span>
        <span className={styles.userInfo}>Current User: {admin?.username}</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Security</div>

          <div className="form-group">
            <label>Current Password *</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              placeholder="Enter current password"
              required
            />
            <small style={{ color: 'var(--text3)' }}>Required to make changes</small>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Change Username</div>

          <div className="form-group">
            <label>New Username</label>
            <input
              type="text"
              value={form.newUsername}
              onChange={(e) => setForm({ ...form, newUsername: e.target.value })}
              placeholder="Leave empty to keep current"
            />
            <small style={{ color: 'var(--text3)' }}>Optional</small>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Change Password</div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={handlePasswordChange}
              placeholder="Leave empty to keep current"
            />
            <small style={{ color: 'var(--text3)' }}>Optional - Leave empty to keep current</small>

            {form.newPassword && (
              <div className={styles.strengthIndicator}>
                <div className={styles.strengthBar}>
                  <div
                    className={styles.strengthFill}
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      background:
                        passwordStrength <= 2
                          ? '#ff4d6d'
                          : passwordStrength <= 3
                          ? '#ffd60a'
                          : '#00ffc6',
                    }}
                  />
                </div>
                <div className={styles.requirements}>
                  <div style={{ color: form.newPassword.length >= 8 ? 'var(--mint)' : 'var(--text3)' }}>
                    ✓ At least 8 characters
                  </div>
                  <div style={{ color: /[A-Z]/.test(form.newPassword) ? 'var(--mint)' : 'var(--text3)' }}>
                    ✓ Uppercase letter (A-Z)
                  </div>
                  <div style={{ color: /[a-z]/.test(form.newPassword) ? 'var(--mint)' : 'var(--text3)' }}>
                    ✓ Lowercase letter (a-z)
                  </div>
                  <div style={{ color: /[0-9]/.test(form.newPassword) ? 'var(--mint)' : 'var(--text3)' }}>
                    ✓ Number (0-9)
                  </div>
                  <div style={{ color: /[!@#$%^&*]/.test(form.newPassword) ? 'var(--mint)' : 'var(--text3)' }}>
                    ✓ Special character (!@#$%^&*)
                  </div>
                </div>
              </div>
            )}
          </div>

          {form.newPassword && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
              {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                <small style={{ color: 'var(--red)' }}>✗ Passwords do not match</small>
              )}
              {form.confirmPassword && form.newPassword === form.confirmPassword && (
                <small style={{ color: 'var(--mint)' }}>✓ Passwords match</small>
              )}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={saving} className={styles.btnSave}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className={styles.warning}>
          ⚠ After updating credentials, you'll need to login again with the new information.
        </div>
      </form>
    </div>
  );
}
