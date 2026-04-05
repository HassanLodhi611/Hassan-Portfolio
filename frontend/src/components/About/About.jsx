import React, { useEffect, useRef } from 'react';
import useReveal from '../../hooks/useReveal';
import styles from './About.module.css';

const HIGHLIGHTS = [
  '🖥 MERN Stack', '🔒 Cybersecurity', '⚛ React Developer',
  '🌐 REST APIs', '🛡 Ethical Hacking', '📦 Node.js',
  '🗄 MongoDB', '🔐 JWT Auth',
];

export default function About() {
  const sectionRef = useReveal();

  return (
    <section id="about" className={styles.about} ref={sectionRef}>
      <div className="section-inner">
        <div className="section-tag">About Me</div>
        <div className={styles.grid}>
          {/* Photo */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className={`${styles.photoWrap} reveal`}>
              <div className={styles.photoInner}>
                <img
                  src={require('./My Pic.jpeg')}
                  alt="Hassan Lodhi"
                  className={styles.photoImg}
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className={`${styles.text} reveal`}>
            <h2 className="section-title">
              Crafting the web,<br />
              <span className="accent-mint">securing</span> the future.
            </h2>
            <p>
              I'm Hassan Lodhi — a passionate web developer on a journey through the MERN stack
              while simultaneously diving deep into the world of cybersecurity. My goal is to become
              a developer who not only builds functional applications but understands the attack
              surfaces and how to defend them.
            </p>
            <p>
              Currently mastering React, Node.js, Express, and MongoDB to build full-stack
              applications, while pursuing certifications in ethical hacking and network security.
              I believe the best developers are those who think like attackers when writing code.
            </p>
            <p>
              When I'm not coding, you'll find me exploring CTF challenges, reading about the latest
              vulnerabilities, or contributing to open-source projects. Every line of code is an
              opportunity to build something both powerful and secure.
            </p>

            <div className={styles.highlights}>
              {HIGHLIGHTS.map((h) => (
                <span key={h} className={styles.pill}>{h}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
