import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, verifyToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]       = useState(null);
  const [loading, setLoading]   = useState(true);

  // On mount, verify stored token
  useEffect(() => {
    const token = localStorage.getItem('hl_token');
    if (!token) { setLoading(false); return; }

    verifyToken()
      .then((res) => setAdmin(res.data.admin))
      .catch(() => localStorage.removeItem('hl_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ username, password }) => {
    const res = await apiLogin({ username, password });
    localStorage.setItem('hl_token', res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hl_token');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
