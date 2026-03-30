import React, { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { getCertificates, createCertificate, updateCertificate, deleteCertificate } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../shared/Modal';
import ImageUpload from '../../shared/ImageUpload';
import styles from './CertificatesPanel.module.css';

const EMPTY = { name: '', issuer: '', date: '', icon: '🎓', verifyUrl: '' };

export default function CertificatesPanel() {
  const { data: certs, loading, refetch } = useFetch(getCertificates);
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [imgFile, setImgFile]     = useState(null);
  const [saving, setSaving]       = useState(false);

  const openAdd = () => {
    setEditing(null); setForm(EMPTY); setImgFile(null); setModalOpen(true);
  };
  const openEdit = (cert) => {
    setEditing(cert);
    setForm({ name: cert.name, issuer: cert.issuer, date: cert.date, icon: cert.icon, verifyUrl: cert.verifyUrl || '' });
    setImgFile(null);
    setModalOpen(true);
  };
  const handleClose = () => { setModalOpen(false); setEditing(null); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);

      if (editing) {
        await updateCertificate(editing._id, fd);
        showToast('Certificate updated!', 'success');
      } else {
        await createCertificate(fd);
        showToast('Certificate added!', 'success');
      }
      handleClose(); refetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete "${cert.name}"?`)) return;
    try {
      await deleteCertificate(cert._id);
      showToast('Certificate deleted', 'error');
      refetch();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.secTitle}>certificates.db</span>
          <span className={styles.count}>{certs?.length ?? 0} records</span>
        </div>
        <button className={styles.btnAdd} onClick={openAdd}>+ ADD CERTIFICATE</button>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className={styles.grid}>
          {(certs || []).map((cert) => (
            <div key={cert._id} className={styles.card}>
              <div className={styles.cardImg}>
                {cert.image?.url
                  ? <img src={cert.image.url} alt={cert.name} className={styles.certPhoto} />
                  : <span className={styles.certEmoji}>{cert.icon}</span>
                }
              </div>
              <div className={styles.cardBody}>
                <div className={styles.certName}>{cert.name}</div>
                <div className={styles.certIssuer}>{cert.issuer}</div>
                <div className={styles.certDate}>📅 {cert.date}</div>
                <div className={styles.cardActions}>
                  <button className={styles.btnEdit} onClick={() => openEdit(cert)}>Edit</button>
                  <button className={styles.btnDel}  onClick={() => handleDelete(cert)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={handleClose} title={editing ? 'edit_certificate' : 'add_certificate'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Certificate Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="The Web Developer Bootcamp" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Issuer / Platform *</label>
              <input name="issuer" value={form.issuer} onChange={handleChange} placeholder="Udemy / Coursera..." required />
            </div>
            <div className="form-group">
              <label>Year / Date</label>
              <input name="date" value={form.date} onChange={handleChange} placeholder="2024" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Emoji Icon</label>
              <input name="icon" value={form.icon} onChange={handleChange} placeholder="🎓" maxLength={4} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="form-group">
              <label>Verify URL</label>
              <input name="verifyUrl" type="url" value={form.verifyUrl} onChange={handleChange} placeholder="https://verify.example.com" />
            </div>
          </div>

          <div className="form-group">
            <label>Certificate Image / Badge</label>
            <ImageUpload
              icon="📜"
              label="Click to upload certificate image or badge"
              subLabel="PNG, JPG, WEBP · Max 5MB · Upload the actual certificate"
              value={editing?.image?.url || ''}
              onChange={setImgFile}
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={handleClose}>Cancel</button>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'UPDATE CERTIFICATE' : 'SAVE CERTIFICATE'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
