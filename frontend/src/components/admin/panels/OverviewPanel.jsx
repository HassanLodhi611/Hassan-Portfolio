import React from 'react';
import useFetch from '../../../hooks/useFetch';
import { getProjects, getCertificates, getSkills } from '../../../services/api';
import styles from './OverviewPanel.module.css';

const ACTIVITY = [
  { type: 'add',  label: 'SecureVault App — project added',         time: '2d ago' },
  { type: 'edit', label: 'About section — bio updated',             time: '3d ago' },
  { type: 'add',  label: 'Google Cybersecurity Certificate added',  time: '5d ago' },
  { type: 'del',  label: 'Old project draft deleted',               time: '7d ago' },
];

export default function OverviewPanel({ onNavigate }) {
  const { data: projects } = useFetch(getProjects);
  const { data: certs }    = useFetch(getCertificates);
  const { data: skills }   = useFetch(getSkills);

  const skillCount = skills ? skills.reduce((acc, s) => acc + (s.tags?.length || 0), 0) : 0;

  const stats = [
    { label: 'Projects',     num: projects?.length ?? '—', change: '↑ All active',     accent: 'var(--mint)', nav: 'projects' },
    { label: 'Certificates', num: certs?.length    ?? '—', change: '↑ Verified',        accent: 'var(--gold)', nav: 'certs' },
    { label: 'Skills',       num: skillCount || '—',       change: '4 categories',      accent: 'var(--purple)', nav: 'skills' },
    { label: 'Status',       num: 'ONLINE',                change: '↑ Portfolio live',  accent: 'var(--red)',  nav: null },
  ];

  return (
    <div>
      <div className={styles.statsRow}>
        {stats.map((s) => (
          <div
            key={s.label}
            className={`${styles.statCard} ${s.nav ? styles.clickable : ''}`}
            style={{ '--s-accent': s.accent }}
            onClick={() => s.nav && onNavigate(s.nav)}
          >
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statNum}>{s.num}</div>
            <div className={`${styles.statChange} ${s.change.startsWith('↑') ? styles.up : ''}`}>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.secHeader}>
        <div className={styles.secTitle}>activity_log.txt</div>
      </div>

      <div className={styles.log}>
        <div className={styles.logHeader}>recent_changes :: last_7_days</div>
        {ACTIVITY.map((a, i) => (
          <div key={i} className={styles.logItem}>
            <span className={`${styles.actType} ${styles[a.type]}`}>
              {a.type === 'add' ? '+ADD' : a.type === 'edit' ? 'EDIT' : 'DEL'}
            </span>
            <span className={styles.actName}>{a.label}</span>
            <span className={styles.actTime}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
