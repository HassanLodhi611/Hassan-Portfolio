import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useReveal from '../../hooks/useReveal';
import { getCertificates } from '../../services/api';
import styles from './Certificates.module.css';

function CertCard({ cert, onClick }) {
  return (
    <div className={`${styles.card} reveal`} onClick={() => onClick(cert)}>
      <div className={styles.imgWrap}>
        {cert.image?.url
          ? <img src={cert.image.url} alt={cert.name} className={styles.certImg} />
          : (
            <div className={styles.imgPlaceholder}>
              <span className={styles.placeholderIcon}>{cert.icon}</span>
              <span className={styles.badgeText}>Certificate</span>
            </div>
          )
        }
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{cert.name}</div>
        <div className={styles.issuer}>{cert.issuer}</div>
        <div className={styles.date}>📅 {cert.date}</div>
        {cert.verifyUrl && cert.verifyUrl !== '#' && (
          <a href={cert.verifyUrl} target="_blank" rel="noreferrer" className={styles.verify}>
            Verify ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function Certificates() {
  const { data, loading } = useFetch(getCertificates);
  const sectionRef = useReveal([data]);
  const [selectedCert, setSelectedCert] = useState(null);
  const certs = data || [];

  return (
    <section id="certificates" className={styles.certs} ref={sectionRef}>
      <div className="section-inner">
        <div className="section-tag">Certifications</div>
        <h2 className="section-title reveal">
          Learning, <span className="accent-gold">certified.</span>
        </h2>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : certs.length > 0 ? (
          <div className={styles.grid}>
            {certs.map((c) => <CertCard key={c._id} cert={c} onClick={setSelectedCert} />)}
          </div>
        ) : (
          <div className={styles.empty}>No certificates found yet. Add via admin panel.</div>
        )}

        {selectedCert && (
          <div className={styles.modalOverlay} onClick={() => setSelectedCert(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <img src={selectedCert.image?.url || ''} alt={selectedCert.name} />
              <button className={styles.modalClose} onClick={() => setSelectedCert(null)}>✕</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
