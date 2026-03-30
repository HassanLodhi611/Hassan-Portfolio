import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminSidebar.module.css';

const NAV_ITEMS = [
  { key: 'overview', icon: '◈', label: 'Overview',       section: 'main' },
  { key: 'projects', icon: '⬡', label: 'Projects',       section: 'content', badge: true },
  { key: 'certs',    icon: '★', label: 'Certificates',   section: 'content', badge: true },
  { key: 'skills',   icon: '◎', label: 'Skills',         section: 'content' },
  { key: 'about',    icon: '✎', label: 'About Section',  section: 'content' },
];

export default function AdminSidebar({ activePanel, setActivePanel, onLogout }) {
  const { admin } = useAuth();

  const sectionLabels = { main: '// MAIN', content: '// CONTENT', system: '// SYSTEM' };
  let lastSection = null;

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>HL</div>
        <div>
          <div className={styles.logoName}>HASSAN_LODHI</div>
          <div className={styles.logoTag}>// portfolio cms</div>
        </div>
      </div>

      {/* Status */}
      <div className={styles.status}>
        <div className={styles.statusDot} />
        <span>SYSTEM ONLINE :: ALL SERVICES UP</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const showLabel = item.section !== lastSection;
          lastSection = item.section;
          return (
            <React.Fragment key={item.key}>
              {showLabel && (
                <div className={styles.sectionLabel}>{sectionLabels[item.section]}</div>
              )}
              <button
                className={`${styles.navItem} ${activePanel === item.key ? styles.active : ''}`}
                onClick={() => setActivePanel(item.key)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          );
        })}

        <div className={styles.sectionLabel}>// SYSTEM</div>
        <button
          className={styles.navItem}
          onClick={() => window.open('/', '_blank')}
        >
          <span className={styles.navIcon}>↗</span>
          <span>View Live Site</span>
        </button>
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.userRow}>
          <div className={styles.avatar}>HL</div>
          <div>
            <div className={styles.userName}>{admin?.username || 'Hassan'}</div>
            <div className={styles.userRole}>Administrator</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout}>
          ⏻ Sign Out
        </button>
      </div>
    </aside>
  );
}
