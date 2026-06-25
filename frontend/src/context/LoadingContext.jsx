import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const activeCount = useRef(0);
  const showTimer = useRef(null);
  const hideTimer = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  const updateVisible = (nextCount) => {
    if (!mounted.current) return;

    if (nextCount > 0) {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      if (!visible && !showTimer.current) {
        showTimer.current = setTimeout(() => {
          showTimer.current = null;
          if (activeCount.current > 0) setVisible(true);
        }, 120);
      }
    } else {
      if (showTimer.current) {
        clearTimeout(showTimer.current);
        showTimer.current = null;
      }
      if (visible && !hideTimer.current) {
        hideTimer.current = setTimeout(() => {
          hideTimer.current = null;
          if (activeCount.current === 0) setVisible(false);
        }, 280);
      }
    }
  };

  const registerRequest = (started) => {
    activeCount.current = Math.max(0, activeCount.current + (started ? 1 : -1));
    updateVisible(activeCount.current);
  };

  const value = {
    loading: visible,
    registerRequest,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  return ctx || { loading: false, registerRequest: () => {} };
}
