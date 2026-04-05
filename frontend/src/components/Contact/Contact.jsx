import React, { useState } from 'react';
import useReveal from '../../hooks/useReveal';
import { useToast } from '../../context/ToastContext';
import styles from './Contact.module.css';

const SOCIAL = [
  { icon: '✉', label: 'Email', href: 'mailto:hassanlodhi261@gmail.com', val: 'hassanlodhi261@gmail.com' },
  { icon: '⌥', label: 'GitHub', href: 'https://github.com/HassanLodhi611', val: 'github.com/HassanLodhi611' },
  { icon: 'in', label: 'LinkedIn', href: 'https://www.linkedin.com/in/hassan-lodhi-2a93b9327/', val: 'hassan-lodhi-2a93b9327' },
];

export default function Contact() {
  const sectionRef = useReveal();
  const { showToast } = useToast();
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSub]    = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSub(true);
    try {
      const formData = new FormData();
      formData.append('access_key', 'cad7263e-1709-467a-9118-ac86fc18e355');
      formData.append('subject', form.subject || 'Contact Form Submission');
      formData.append('from_name', form.name);
      formData.append('email', form.email);
      formData.append('message', form.message);
      formData.append('to', 'hassanlodhi261@gmail.com');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        showToast("Message sent! I'll respond within 24h.", 'success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast('Failed to send. Please email directly.', 'error');
      }
    } catch {
      showToast('Failed to send. Please email directly.', 'error');
    } finally {
      setSub(false);
    }
  };

  return (
    <section id="contact" className={styles.contact} ref={sectionRef}>
      <div className="section-inner">
        <div className="section-tag">Contact</div>
        <h2 className="section-title reveal">
          Let's <span className="accent-mint">connect</span>
        </h2>

        <div className={styles.wrap}>
          {/* Info column */}
          <div className={`${styles.info} reveal`}>
            <h3 className={styles.infoTitle}>Open to opportunities</h3>
            <p className={styles.infoText}>
              Whether you have a project in mind, a question about security, or just
              want to say hello — my inbox is always open. I respond within 24 hours.
            </p>
            <div className={styles.links}>
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={styles.link}>
                  <div className={styles.linkIcon}>{s.icon}</div>
                  <div className={styles.linkInfo}>
                    <div className={styles.linkLabel}>{s.label}</div>
                    <div className={styles.linkVal}>{s.val}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className={`${styles.formWrap} reveal`}>
            <div className={styles.formTitle}> Send Message</div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" type="text" placeholder="John Doe"
                    value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" placeholder="john@email.com"
                    value={form.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input name="subject" type="text" placeholder="Project collaboration"
                  value={form.subject} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" placeholder="Tell me about your project..."
                  value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
