import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import OverviewPanel from '../components/admin/panels/OverviewPanel';
import ProjectsPanel from '../components/admin/panels/ProjectsPanel';
import CertificatesPanel from '../components/admin/panels/CertificatesPanel';
import SkillsPanel from '../components/admin/panels/SkillsPanel';
import AboutPanel from '../components/admin/panels/AboutPanel';
import AccountPanel from '../components/admin/panels/AccountPanel';
import styles from './AdminPage.module.css';

export const PANELS = {
  overview:  { label: 'Overview',      path: 'overview' },
  projects:  { label: 'projects.db',   path: 'projects' },
  certs:     { label: 'certificates.db', path: 'certs' },
  skills:    { label: 'skills.json',   path: 'skills' },
  about:     { label: 'about.json',    path: 'about' },
  account:   { label: 'Account Settings', path: 'account' },
};

export default function AdminPage() {
  const [activePanel, setActivePanel] = useState('overview');
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'success');
    navigate('/admin/login', { replace: true });
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':  return <OverviewPanel onNavigate={setActivePanel} />;
      case 'projects':  return <ProjectsPanel />;
      case 'certs':     return <CertificatesPanel />;
      case 'skills':    return <SkillsPanel />;
      case 'about':     return <AboutPanel />;
      case 'account':   return <AccountPanel />;
      default:          return <OverviewPanel onNavigate={setActivePanel} />;
    }
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar activePanel={activePanel} setActivePanel={setActivePanel} onLogout={handleLogout} />
      <div className={styles.main}>
        <AdminTopbar panelKey={activePanel} />
        <div className={styles.content}>
          {renderPanel()}
        </div>
      </div>
    </div>
  );
}
