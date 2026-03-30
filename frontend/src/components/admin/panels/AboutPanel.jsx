import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import ImageUpload from '../../shared/ImageUpload';
import { getAbout, updateAbout } from '../../../services/api';
import styles from './AboutPanel.module.css';

/* 
  In production this panel would GET/PUT /api/about from a dedicated About model.
  Here we manage local state which would be wired to a backend endpoint in full deployment.
  The structure is identical — just swap useState init values with useFetch data.
*/

const DEFAULT_HIGHLIGHTS = [
  '🖥 MERN Stack', '🔒 Cybersecurity', '⚛ React Developer',
  '🌐 REST APIs', '🛡 Ethical Hacking', '📦 Node.js', '🗄 MongoDB', '🔐 JWT Auth',
];

export default function AboutPanel() {
  const { showToast } = useToast();

  const [photo, setPhoto]     = useState(null);
  const [form, setForm]       = useState({
    name:     'Hassan Lodhi',
    role:     'Web Developer & Cybersecurity Enthusiast',
    tagline:  'Web Developer | Cybersecurity Learner',
    projects: '15+',
    certs:    '5+',
    p1: "I'm Hassan Lodhi — a passionate web developer on a journey through the MERN stack while simultaneously diving deep into the world of cybersecurity.",
    p2: "Currently mastering React, Node.js, Express, and MongoDB to build full-stack applications, while pursuing certifications in ethical hacking and network security.",
    p3: "When I'm not coding, you'll find me exploring CTF challenges, reading about the latest vulnerabilities, or contributing to open-source projects.",
  });

  const [highlights, setHighlights]   = useState(DEFAULT_HIGHLIGHTS);
  const [newHighlight, setNewHighlight] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  React.useEffect(() => {
    (async () => {
      try {
        const response = await getAbout();
        const about = response.data.data;
        setForm({
          name: about.name,
          role: about.role,
          tagline: about.tagline,
          projects: about.projects,
          certs: about.certs,
          p1: about.p1,
          p2: about.p2,
          p3: about.p3,
        });
        setHighlights(about.highlights.length ? about.highlights : DEFAULT_HIGHLIGHTS);
        setPhoto(about.image?.url || null);
      } catch (err) {
        console.log('About fetch failed', err);
      }
    })();
  }, []);

  const addHighlight = () => {
    const val = newHighlight.trim();
    if (!val) return;
    setHighlights([...highlights, val]);
    setNewHighlight('');
  };
  const removeHighlight = (idx) => setHighlights(highlights.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('role', form.role);
      fd.append('tagline', form.tagline);
      fd.append('projects', form.projects);
      fd.append('certs', form.certs);
      fd.append('p1', form.p1);
      fd.append('p2', form.p2);
      fd.append('p3', form.p3);
      fd.append('highlights', JSON.stringify(highlights));
      if (photo instanceof File) {
        fd.append('image', photo);
      }

      await updateAbout(fd);
      showToast('About section saved!', 'success');

      const { data } = await getAbout();
      setForm({
        name: data.data.name,
        role: data.data.role,
        tagline: data.data.tagline,
        projects: data.data.projects,
        certs: data.data.certs,
        p1: data.data.p1,
        p2: data.data.p2,
        p3: data.data.p3,
      });
      setHighlights(data.data.highlights);
      setPhoto(data.data.image?.url ? data.data.image.url : null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.secTitle}>about.json</span>
          <span className={styles.count}>Profile section</span>
        </div>
        <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'SAVE CHANGES'}
        </button>
      </div>

      <div className={styles.grid}>
        {/* LEFT COLUMN */}
        <div>
          {/* Photo upload */}
          <div className={styles.block}>
            <div className={styles.blockTitle}>profile_photo</div>
            <div className={styles.currentPhoto}>
              {photo ? (
                <img
                  src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                  alt="Profile"
                  className={styles.photoImg}
                />
              ) : (
                <span className={styles.photoEmoji}>👨‍💻</span>
              )}
            </div>
            <ImageUpload
              icon="📁"
              label="Click or drag to upload profile photo"
              subLabel="JPG, PNG, WEBP · Max 5MB; 1:1 recommended, 1024×1024 creates higher fidelity"
              value={photo || ''}
              onChange={setPhoto}
            />
          </div>

          {/* Quick stats */}
          <div className={styles.block} style={{ marginTop: '1rem' }}>
            <div className={styles.blockTitle}>quick_stats</div>
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Title / Role</label>
              <input name="role" value={form.role} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input name="tagline" value={form.tagline} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Projects Count</label>
                <input name="projects" value={form.projects} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Certs Count</label>
                <input name="certs" value={form.certs} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Bio paragraphs */}
          <div className={styles.block} style={{ marginBottom: '1rem' }}>
            <div className={styles.blockTitle}>bio_paragraphs</div>
            <div className="form-group">
              <label>Paragraph 1 — Introduction</label>
              <textarea name="p1" value={form.p1} onChange={handleChange} style={{ height: '90px' }} />
            </div>
            <div className="form-group">
              <label>Paragraph 2 — Technical Focus</label>
              <textarea name="p2" value={form.p2} onChange={handleChange} style={{ height: '90px' }} />
            </div>
            <div className="form-group">
              <label>Paragraph 3 — Personal / Extra</label>
              <textarea name="p3" value={form.p3} onChange={handleChange} style={{ height: '90px' }} />
            </div>
          </div>

          {/* Highlight pills */}
          <div className={styles.block}>
            <div className={styles.blockTitle}>highlight_pills</div>
            <div className={styles.pillsWrap}>
              {highlights.map((h, i) => (
                <span key={i} className={styles.pill}>
                  {h}
                  <button className={styles.removePill} onClick={() => removeHighlight(i)}>✕</button>
                </span>
              ))}
            </div>
            <div className={styles.addRow}>
              <input
                type="text"
                placeholder="e.g. 🔐 JWT Auth"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                className={styles.addInput}
              />
              <button className={styles.addBtn} onClick={addHighlight}>+ Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
