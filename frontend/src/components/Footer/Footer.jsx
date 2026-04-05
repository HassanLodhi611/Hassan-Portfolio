import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const SOCIALS = [
  { icon: '⌥', href: 'https://github.com', label: 'GitHub' },
  { icon: 'in', href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: '✉',  href: 'mailto:hassan@example.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Logo + tagline */}
          <div className={styles.logoWrap}>
            <div className={styles.logoMark}>HL</div>
            <div>
              <div className={styles.logoName}>Hassan Lodhi</div>
              <div className={styles.tagline}>Web Developer | Cybersecurity Learner</div>
            </div>
          </div>

          {/* Socials + Admin link */}
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className={styles.socialLink} title={s.label}>
                {s.icon}
              </a>
            ))}
            <Link to="/admin" className={styles.adminLink}>
              <span className={styles.adminDot} />
              Admin Panel
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copy}>© {new Date().getFullYear()} Hassan Lodhi. All rights reserved.</div>
          
        </div>
      </div>
    </footer>
  );
}
