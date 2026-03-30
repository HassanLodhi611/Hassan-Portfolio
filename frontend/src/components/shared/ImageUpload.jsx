import React, { useRef, useState, useEffect } from 'react';
import styles from './ImageUpload.module.css';

/**
 * Reusable image-upload zone.
 * Props:
 *   label      – text shown in the zone
 *   subLabel   – hint text (formats, size)
 *   icon       – emoji icon shown in zone
 *   value      – existing image URL (for edit mode preview)
 *   onChange   – callback(File | null)
 */
export default function ImageUpload({ label = 'Click to upload or drag & drop', subLabel = 'PNG, JPG, WEBP · Max 5MB', icon = '🖼', value, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (value) {
      setPreview(value);
    } else if (!preview) {
      setPreview('');
    }
  }, [value]);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setFileName(file.name);
    onChange(file);
  };

  const handleChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleRemove = () => {
    setPreview('');
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
  };

  return (
    <div className={styles.wrap}>
      {!preview ? (
        <div
          className={`${styles.zone} ${dragging ? styles.dragging : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className={styles.hiddenInput}
          />
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
          <span className={styles.sub}>{subLabel}</span>
        </div>
      ) : (
        <div className={styles.previewWrap}>
          <img src={preview} alt="Preview" className={styles.preview} />
          <button type="button" className={styles.remove} onClick={handleRemove}>✕</button>
          {fileName && <p className={styles.fileName}>{fileName}</p>}
        </div>
      )}
    </div>
  );
}
