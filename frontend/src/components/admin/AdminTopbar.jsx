import React from 'react';
import styles from './AdminTopbar.module.css';

const PANEL_META = {
  overview: { title: 'Overview',        path: 'overview' },
  projects: { title: 'projects.db',     path: 'projects' },
  certs:    { title: 'certificates.db', path: 'certs' },
  skills:   { title: 'skills.json',     path: 'skills' },
  about:    { title: 'about.json',      path: 'about' },
};

export default function AdminTopbar({ panelKey }) {
  const meta = PANEL_META[panelKey] || PANEL_META.overview;

  return (
    <div className={styles.topbar}>
      <div>
        <div className={styles.path}>
          <span>root</span>
          <span className={styles.sep}>/</span>
          <span>admin</span>
          <span className={styles.sep}>/</span>
          <span className={styles.cur}>{meta.path}</span>
        </div>
        <div className={styles.title}>{meta.title}</div>
      </div>
      <a href="/" target="_blank" rel="noreferrer" className={styles.viewSite}>
        ↗ Live Site
      </a>
    </div>
  );
}
