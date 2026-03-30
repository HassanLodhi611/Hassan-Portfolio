import React, { useRef, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import useReveal from '../../hooks/useReveal';
import { getSkills } from '../../services/api';
import styles from './Skills.module.css';

/* Fallback data shown while loading or if API has no data yet */
const FALLBACK = [
  {
    _id: 'fe', category: 'Frontend Development', icon: '⚛', accentColor: 'mint',
    tags: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind', 'Redux'],
    bars: [{ label: 'React', width: 75 }, { label: 'JS', width: 80 }, { label: 'CSS', width: 85 }],
  },
  {
    _id: 'be', category: 'Backend Development', icon: '⚙', accentColor: 'gold',
    tags: ['Node.js', 'Express', 'REST API', 'JWT', 'Bcrypt', 'Middleware'],
    bars: [{ label: 'Node', width: 70 }, { label: 'Express', width: 72 }, { label: 'APIs', width: 78 }],
  },
  {
    _id: 'db', category: 'Database', icon: '🗄', accentColor: 'red',
    tags: ['MongoDB', 'Mongoose', 'Atlas', 'Aggregation', 'Indexing'],
    bars: [{ label: 'MongoDB', width: 68 }, { label: 'Mongoose', width: 72 }],
  },
  {
    _id: 'sec', category: 'Cybersecurity', icon: '🛡', accentColor: 'purple',
    tags: ['Linux', 'Nmap', 'Burp Suite', 'OWASP Top 10', 'CTF', 'Networking'],
    bars: [{ label: 'Linux', width: 65 }, { label: 'OWASP', width: 60 }],
  },
];

function SkillCard({ skill }) {
  const cardRef = useRef(null);

  // Animate bars when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('[data-width]').forEach((bar) => {
          bar.style.width = bar.dataset.width + '%';
        });
        obs.unobserve(el);
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.card} reveal`}
      data-cat={skill.accentColor}
    >
      <div className={styles.icon}>{skill.icon}</div>
      <div className={`${styles.cardTitle} ${styles[skill.accentColor]}`}>
        {skill.category}
      </div>
      <div className={styles.tags}>
        {skill.tags.map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>
      {skill.bars?.length > 0 && (
        <div className={styles.bars}>
          {skill.bars.map((b) => (
            <div key={b.label} className={styles.barRow}>
              <span className={styles.barLabel}>{b.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  data-width={b.width}
                  style={{ width: 0 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Skills() {
  const { data, loading } = useFetch(getSkills);
  const sectionRef = useReveal([data]);
  const skills = (data && data.length > 0) ? data : FALLBACK;

  return (
    <section id="skills" className={styles.skills} ref={sectionRef}>
      <div className="section-inner">
        <div className="section-tag">Skills &amp; Technologies</div>
        <h2 className="section-title reveal">What I work with</h2>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className={styles.grid}>
            {skills.map((s) => <SkillCard key={s._id} skill={s} />)}
          </div>
        )}
      </div>
    </section>
  );
}
