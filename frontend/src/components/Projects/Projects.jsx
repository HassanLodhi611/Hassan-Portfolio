import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useReveal from '../../hooks/useReveal';
import { getProjects } from '../../services/api';
import styles from './Projects.module.css';

const FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'web',      label: 'Web Apps' },
  { key: 'security', label: 'Security' },
  { key: 'api',      label: 'APIs' },
];

const FALLBACK = [
  { _id: '1', category: 'web',      title: 'SecureVault App',      description: 'Full-stack MERN app with E2E encryption and JWT authentication.', stack: ['React','Node.js','MongoDB','JWT'], emoji: '🔐', github: '#', demo: '#', image: { url: '' } },
  { _id: '2', category: 'web',      title: 'E-Commerce Platform',  description: 'Feature-rich shopping platform with cart, payments, and admin dashboard.', stack: ['React','Express','MongoDB','Stripe'], emoji: '🛒', github: '#', demo: '#', image: { url: '' } },
  { _id: '3', category: 'security', title: 'Port Scanner Tool',    description: 'Python-based port scanner with service detection and banner grabbing.', stack: ['Python','Socket','Threading'], emoji: '🔎', github: '#', demo: '', image: { url: '' } },
  { _id: '4', category: 'api',      title: 'RESTful Blog API',     description: 'Production-ready blog API with rate limiting, pagination, and CORS.', stack: ['Node.js','Express','JWT','Helmet'], emoji: '📡', github: '#', demo: '#', image: { url: '' } },
  { _id: '5', category: 'security', title: 'Password Analyzer',    description: 'Password strength checker with entropy calculation and HIBP integration.', stack: ['React','Node.js'], emoji: '🔑', github: '#', demo: '#', image: { url: '' } },
  { _id: '6', category: 'web',      title: 'Portfolio CMS',        description: 'Custom CMS backend for dynamic portfolio content management.', stack: ['React','MongoDB','Cloudinary'], emoji: '💼', github: '#', demo: '', image: { url: '' } },
];

function ProjectCard({ project }) {
  return (
    <div className={`${styles.card} reveal`}>
      <div className={styles.img}>
        {project.image?.url
          ? <img src={project.image.url} alt={project.title} className={styles.imgPhoto} />
          : <span className={styles.imgEmoji}>{project.emoji}</span>
        }
        <div className={styles.overlay}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" title="GitHub">⌥</a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" title="Live Demo">↗</a>
          )}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.cat}>{project.category}</div>
        <div className={styles.title}>{project.title}</div>
        <div className={styles.desc}>{project.description}</div>
        <div className={styles.stack}>
          {project.stack.map((t) => (
            <span key={t} className={styles.stackPill}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const { data, loading } = useFetch(getProjects);
  const sectionRef = useReveal([filter, data]);

  const all = (data && data.length > 0) ? data : FALLBACK;
  const visible = filter === 'all' ? all : all.filter((p) => p.category === filter);

  return (
    <section id="projects" className={styles.projects} ref={sectionRef}>
      <div className="section-inner">
        <div className="section-tag">Projects</div>
        <h2 className="section-title reveal">
          Things I've <span className="accent-mint">built</span>
        </h2>

        <div className={`${styles.filters} reveal`}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.active : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className={styles.grid}>
            {visible.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
