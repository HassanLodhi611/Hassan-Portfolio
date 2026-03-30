import React, { useState, useCallback } from 'react';
import useFetch from '../../../hooks/useFetch';
import { getProjects, createProject, updateProject, deleteProject } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../shared/Modal';
import ImageUpload from '../../shared/ImageUpload';
import styles from './ProjectsPanel.module.css';

const EMPTY = { title: '', description: '', category: 'web', emoji: '🚀', stack: '', github: '', demo: '' };

export default function ProjectsPanel() {
  const { data: projects, loading, refetch } = useFetch(getProjects);
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);   // null = add mode, obj = edit mode
  const [form, setForm]           = useState(EMPTY);
  const [imgFile, setImgFile]     = useState(null);
  const [saving, setSaving]       = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setImgFile(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title:       project.title,
      description: project.description,
      category:    project.category,
      emoji:       project.emoji,
      stack:       project.stack.join(', '),
      github:      project.github || '',
      demo:        project.demo   || '',
    });
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
        await updateProject(editing._id, fd);
        showToast('Project updated!', 'success');
      } else {
        await createProject(fd);
        showToast('Project added!', 'success');
      }
      handleClose();
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    try {
      await deleteProject(project._id);
      showToast('Project deleted', 'error');
      refetch();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const catClass = { web: styles.catWeb, security: styles.catSec, api: styles.catApi };

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.secTitle}>projects.db</span>
          <span className={styles.count}>{projects?.length ?? 0} records</span>
        </div>
        <button className={styles.btnAdd} onClick={openAdd}>+ ADD PROJECT</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Project</th>
                <th>Category</th>
                <th>Stack</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(projects || []).map((p) => (
                <tr key={p._id}>
                  <td>
                    {p.image?.url
                      ? <img src={p.image.url} alt={p.title} className={styles.thumb} />
                      : <div className={styles.thumbPlaceholder}>{p.emoji}</div>
                    }
                  </td>
                  <td>
                    <div className={styles.tdName}>{p.title}</div>
                    <div className={styles.tdSub}>{p.description?.substring(0, 55)}...</div>
                  </td>
                  <td>
                    <span className={`${styles.catBadge} ${catClass[p.category] || ''}`}>
                      {p.category}
                    </span>
                  </td>
                  <td>
                    <div className={styles.pills}>
                      {p.stack?.slice(0, 3).map((t) => (
                        <span key={t} className={styles.pill}>{t}</span>
                      ))}
                      {p.stack?.length > 3 && (
                        <span className={styles.pill}>+{p.stack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.btnEdit} onClick={() => openEdit(p)}>Edit</button>
                      <button className={styles.btnDel}  onClick={() => handleDelete(p)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleClose}
        title={editing ? 'edit_project' : 'add_project'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="My Awesome Project" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="web">Web App</option>
                <option value="security">Security</option>
                <option value="api">API</option>
              </select>
            </div>
            <div className="form-group">
              <label>Emoji Icon</label>
              <input name="emoji" value={form.emoji} onChange={handleChange} placeholder="🚀" maxLength={4} style={{ fontSize: '1.1rem' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="What does this project do?" />
          </div>

          <div className="form-group">
            <label>Project Image / Screenshot</label>
            <ImageUpload
              icon="🖼"
              label="Click to upload or drag & drop"
              subLabel="PNG, JPG, WEBP · Max 5MB · 16:9 recommended"
              value={editing?.image?.url || ''}
              onChange={setImgFile}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub URL</label>
              <input name="github" type="url" value={form.github} onChange={handleChange} placeholder="https://github.com/..." />
            </div>
            <div className="form-group">
              <label>Live Demo URL</label>
              <input name="demo" type="url" value={form.demo} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div className="form-group">
            <label>Tech Stack (comma-separated)</label>
            <input name="stack" value={form.stack} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={handleClose}>Cancel</button>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'UPDATE PROJECT' : 'SAVE PROJECT'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
