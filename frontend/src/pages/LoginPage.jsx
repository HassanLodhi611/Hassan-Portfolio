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
  const [clock, setClock]     = useState('');

  // Live clock
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setClock([n.getHours(), n.getMinutes(), n.getSeconds()].map((x) => String(x).padStart(2, '0')).join(':'));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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
      {/* Corner labels */}
      <div className={`${styles.corner} ${styles.tl}`}>HASSAN_LODHI::PORTFOLIO_CMS&nbsp; SYS_VERSION 2.0.1</div>
      <div className={`${styles.corner} ${styles.tr}`}>{clock}</div>
      <div className={`${styles.corner} ${styles.bl}`}>ACCESS_TERMINAL :: /admin</div>
      <div className={`${styles.corner} ${styles.br}`}>ENCRYPTED_CHANNEL :: TLS1.3</div>

      <div className={styles.box}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark}>HL</div>
          <div className={styles.sysTag}>portfolio_cms // admin_interface</div>
        </div>
        <div className={styles.title}>Secure Access</div>
        <div className={styles.sub}>// authenticate to continue</div>

        {/* Boot log */}
        <div className={styles.bootLog}>
          <div className={styles.bootLine}>[SYS] Initializing secure session...</div>
          <div className={`${styles.bootLine} ${styles.ok}`}>[OK ] TLS handshake complete</div>
          <div className={`${styles.bootLine} ${styles.ok}`}>[OK ] Database connection established</div>
          {error
            ? <div className={`${styles.bootLine} ${styles.err}`}>[ERR] {error}</div>
            : <div className={`${styles.bootLine} ${styles.warn}`}>[!  ] Awaiting credentials...</div>
          }
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <div className={styles.inputWrap}>
              <span className={styles.prefix}>user$</span>
              <input
                type="text"
                placeholder="admin"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.prefix}>pass$</span>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          <button type="submit" className={styles.btnLogin} disabled={submitting}>
            {submitting ? 'AUTHENTICATING...' : 'AUTHENTICATE →'}
          </button>
        </form>

        <div className={styles.footer}>
          <a href="/" className={styles.backLink}>← back to portfolio</a>
          <span>hint: admin / admin123</span>
        </div>
      </div>
    </div>
  );
}
