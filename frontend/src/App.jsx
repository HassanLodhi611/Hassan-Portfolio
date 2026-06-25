import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';
import AppLoader from './components/shared/AppLoader';
import PortfolioPage from './pages/PortfolioPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/shared/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LoadingProvider>
          <AppLoader />
          <Routes>
            <Route path="/"       element={<PortfolioPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </LoadingProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
