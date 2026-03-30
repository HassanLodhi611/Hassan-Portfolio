import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '#about',        label: 'About' },
  { href: '#skills',       label: 'Skills' },
  { href: '#projects',     label: 'Projects' },
  { href: '#certificates', label: 'Certs' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#hero" className={styles.logo}>
          <div className={styles.logoMark}>HL</div>
          <div className={styles.logoText}>
            Hassan <span>Lodhi</span>
          </div>
        </a>

        <div className={styles.links}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className={`${styles.link} ${styles.navBtn}`}>
            Contact
          </a>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.barOpen1 : ''} />
          <span className={menuOpen ? styles.barOpen2 : ''} />
          <span className={menuOpen ? styles.barOpen3 : ''} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={closeMenu} className={styles.mobileLink}>
            {l.label}
          </a>
        ))}
        <a href="#contact" onClick={closeMenu} className={styles.mobileLink}>Contact</a>
        <Link to="/admin" onClick={closeMenu} className={styles.mobileLink}>
          Admin Panel →
        </Link>
      </div>
    </>
  );
}
