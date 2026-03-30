import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast]   = useState({ msg: '', type: 'success', show: false });
  const timerRef            = useRef(null);

  const showToast = useCallback((msg, type = 'success') => {
    clearTimeout(timerRef.current);
    setToast({ msg, type, show: true });
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
        <span className="toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
        <span className="toast-msg">{toast.msg}</span>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
