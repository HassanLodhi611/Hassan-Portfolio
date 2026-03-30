import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [submitting, setSub]  = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSub(true);
    try {
      await login(form);
      showToast('Access granted. Welcome, Admin.', 'success');
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Access denied.');
    } finally {
      setSub(false);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.box}>
        <div className={styles.title}>Admin Login</div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

