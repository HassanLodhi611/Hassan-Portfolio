import React, { useState } from 'react';
import useReveal from '../../hooks/useReveal';
import { useToast } from '../../context/ToastContext';
import styles from './Contact.module.css';

export default function Contact() {
  const sectionRef = useReveal();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please complete name, email and message fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('access_key', 'cad7263e-1709-467a-9118-ac86fc18e355');
      fd.append('subject', form.subject || 'Contact Form Submission');
      fd.append('from_name', form.name);
      fd.append('email', form.email);
      fd.append('message', form.message);

      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        showToast("Message sent — I'll reply within 24h.", 'success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast('Failed to send message — please email directly.', 'error');
      }
    } catch (err) {
      showToast('Network error sending message.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className={styles.contact} ref={sectionRef}>
      <div className="section-inner">
        <div className="section-tag">Contact</div>
        <h2 className="section-title reveal">Let's <span className="accent-mint">connect</span></h2>

        <div className={styles.wrap}>
          <div className={`${styles.info} reveal`}>
            <h3 className={styles.infoTitle}>Open to opportunities</h3>
            <p className={styles.infoText}>
              Whether you have a project idea, a security question, or just want to say hi — reach out and I'll reply soon.
            </p>

            <div className={styles.links}>
              <a className={styles.link} href="mailto:hassanlodhi261@gmail.com">
                <div className={styles.linkIcon}>✉</div>
                <div>
                  <div className={styles.linkLabel}>Email</div>
                  <div className={styles.linkVal}>hassanlodhi261@gmail.com</div>
                </div>
              </a>
              <a className={styles.link} href="https://github.com/HassanLodhi611" target="_blank" rel="noreferrer">
                <div className={styles.linkIcon}>⌥</div>
                <div>
                  <div className={styles.linkLabel}>GitHub</div>
                  <div className={styles.linkVal}>github.com/HassanLodhi611</div>
                </div>
              </a>
              <a className={styles.link} href="https://www.linkedin.com/in/hassan-lodhi-2a93b9327/" target="_blank" rel="noreferrer">
                <div className={styles.linkIcon}>in</div>
                <div>
                  <div className={styles.linkLabel}>LinkedIn</div>
                  <div className={styles.linkVal}>hassan-lodhi-2a93b9327</div>
                </div>
              </a>
            </div>
          </div>

          <div className={`${styles.formWrap} reveal`}>
            <div className={styles.formTitle}>Send Message</div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" type="text" placeholder="Project, question, etc." value={form.subject} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Tell me about your project..." value={form.message} onChange={handleChange} required />
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
