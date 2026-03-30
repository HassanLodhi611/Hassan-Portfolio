import React, { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import styles from './SkillsPanel.module.css';

export default function SkillsPanel() {
  const { data: skills, loading, refetch } = useFetch(getSkills);
  const { showToast } = useToast();
  const [newTag, setNewTag]   = useState({});   // { [skillId]: '' }
  const [newBar, setNewBar]   = useState({});   // { [skillId]: { label: '', width: 50 } }
  const [editIcon, setEditIcon] = useState({});  // { [skillId]: 'icon' }
  const [saving, setSaving]   = useState(null); // skillId being saved

  /* ── Add a tag to an existing skill ── */
  const addTag = async (skill) => {
    const tag = (newTag[skill._id] || '').trim();
    if (!tag) return;
    setSaving(skill._id);
    try {
      await updateSkill(skill._id, { ...skill, tags: [...skill.tags, tag] });
      setNewTag((prev) => ({ ...prev, [skill._id]: '' }));
      refetch();
    } catch {
      showToast('Failed to add tag', 'error');
    } finally {
      setSaving(null);
    }
  };

  /* ── Remove a tag ── */
  const removeTag = async (skill, idx) => {
    const updated = skill.tags.filter((_, i) => i !== idx);
    setSaving(skill._id);
    try {
      await updateSkill(skill._id, { ...skill, tags: updated });
      refetch();
      showToast('Tag removed', 'error');
    } catch {
      showToast('Failed to remove tag', 'error');
    } finally {
      setSaving(null);
    }
  };

  /* ── Add a proficiency bar ── */
  const addBar = async (skill) => {
    const barData = newBar[skill._id];
    if (!barData || !barData.label.trim()) return;
    setSaving(skill._id);
    try {
      const updatedBars = [...(skill.bars || []), { label: barData.label.trim(), width: Math.min(100, Math.max(0, barData.width || 50)) }];
      await updateSkill(skill._id, { ...skill, bars: updatedBars });
      setNewBar((prev) => ({ ...prev, [skill._id]: { label: '', width: 50 } }));
      refetch();
      showToast('Proficiency added!', 'success');
    } catch {
      showToast('Failed to add proficiency', 'error');
    } finally {
      setSaving(null);
    }
  };

  /* ── Remove a proficiency bar ── */
  const removeBar = async (skill, idx) => {
    const updated = skill.bars.filter((_, i) => i !== idx);
    setSaving(skill._id);
    try {
      await updateSkill(skill._id, { ...skill, bars: updated });
      refetch();
      showToast('Proficiency removed', 'success');
    } catch {
      showToast('Failed to remove proficiency', 'error');
    } finally {
      setSaving(null);
    }
  };

  /* ── Update proficiency bar width ── */
  const updateBar = async (skill, idx, newWidth) => {
    const updated = [...skill.bars];
    updated[idx].width = Math.min(100, Math.max(0, newWidth));
    setSaving(skill._id);
    try {
      await updateSkill(skill._id, { ...skill, bars: updated });
      refetch();
      showToast('Proficiency updated', 'success');
    } catch {
      showToast('Failed to update proficiency', 'error');
    } finally {
      setSaving(null);
    }
  };

  /* ── Update skill icon ── */
  const updateIcon = async (skill, newIcon) => {
    if (!newIcon.trim()) {
      showToast('Icon cannot be empty', 'error');
      return;
    }
    setSaving(skill._id);
    try {
      await updateSkill(skill._id, { ...skill, icon: newIcon.trim().substring(0, 4) });
      setEditIcon((prev) => ({ ...prev, [skill._id]: false }));
      refetch();
      showToast('Icon updated!', 'success');
    } catch {
      showToast('Failed to update icon', 'error');
    } finally {
      setSaving(null);
    }
  };

  /* ── Delete whole skill category ── */
  const handleDelete = async (skill) => {
    if (!window.confirm(`Delete "${skill.category}" category?`)) return;
    try {
      await deleteSkill(skill._id);
      showToast('Category deleted', 'error');
      refetch();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  /* ── Add new skill category ── */
  const [newCat, setNewCat] = useState({ category: '', icon: '', accentColor: 'mint' });
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await createSkill({ ...newCat, tags: [], bars: [] });
      showToast('Category created!', 'success');
      setNewCat({ category: '', icon: '', accentColor: 'mint' });
      refetch();
    } catch {
      showToast('Create failed', 'error');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.secTitle}>skills.json</span>
          <span className={styles.count}>{skills?.length ?? 0} categories</span>
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className={styles.grid}>
          {(skills || []).map((skill) => (
            <div key={skill._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.catTitle}>
                  {editIcon[skill._id] ? (
                    <input
                      type="text"
                      value={editIcon[skill._id] !== true ? editIcon[skill._id] : skill.icon}
                      onChange={(e) => setEditIcon((prev) => ({ ...prev, [skill._id]: e.target.value }))}
                      maxLength={4}
                      style={{
                        fontSize: '1.3rem',
                        width: '50px',
                        padding: '4px 8px',
                        background: 'var(--bg3)',
                        border: '1px solid var(--mint)',
                        borderRadius: '6px',
                        color: 'var(--text)',
                        textAlign: 'center',
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={styles.catIcon}
                      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                      title="Click icon to edit"
                    >
                      {skill.icon || '🔧'}
                    </span>
                  )}
                  {editIcon[skill._id] ? (
                    <div style={{ display: 'flex', gap: '6px', marginLeft: '8px' }}>
                      <button
                        onClick={() => updateIcon(skill, editIcon[skill._id] || skill.icon)}
                        style={{
                          padding: '4px 10px',
                          background: 'var(--mint)',
                          color: 'var(--bg)',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                        disabled={saving === skill._id}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditIcon((prev) => ({ ...prev, [skill._id]: false }))}
                        style={{
                          padding: '4px 10px',
                          background: 'var(--border)',
                          color: 'var(--text2)',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                        disabled={saving === skill._id}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditIcon((prev) => ({ ...prev, [skill._id]: skill.icon }))}
                      style={{
                        padding: '4px 8px',
                        background: 'var(--border)',
                        color: 'var(--mint)',
                        border: '1px solid var(--mint)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginLeft: '8px',
                      }}
                      disabled={saving === skill._id}
                      title="Edit this skill's icon"
                    >
                      ✎ Edit
                    </button>
                  )}
                  <span style={{ marginLeft: '8px' }}>{skill.category}</span>
                </div>
                <div className={styles.headerRight}>
                  <span className={styles.tagCount}>{skill.tags.length} tags</span>
                  <button className={styles.btnDelCat} onClick={() => handleDelete(skill)}>✕</button>
                </div>
              </div>

              <div className={styles.tagsWrap}>
                {skill.tags.map((t, i) => (
                  <span key={i} className={styles.tag}>
                    {t}
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTag(skill, i)}
                      disabled={saving === skill._id}
                    >✕</button>
                  </span>
                ))}
              </div>

              <div className={styles.addRow}>
                <input
                  type="text"
                  placeholder="Add new skill..."
                  value={newTag[skill._id] || ''}
                  onChange={(e) => setNewTag((prev) => ({ ...prev, [skill._id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(skill); } }}
                  className={styles.addInput}
                />
                <button
                  className={styles.addBtn}
                  onClick={() => addTag(skill)}
                  disabled={saving === skill._id}
                >+</button>
              </div>

              {/* Proficiency Bars Section */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--mint)', fontWeight: 600, marginBottom: '0.8rem' }}>
                  Proficiency Levels ({skill.bars?.length || 0})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.8rem' }}>
                  {skill.bars?.map((bar, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ minWidth: '80px', fontSize: '0.85rem', color: 'var(--text2)' }}>{bar.label}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bar.width}
                        onChange={(e) => updateBar(skill, i, parseInt(e.target.value))}
                        disabled={saving === skill._id}
                        style={{ flex: 1, cursor: 'pointer' }}
                      />
                      <span style={{ minWidth: '40px', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text2)' }}>{bar.width}%</span>
                      <button
                        className={styles.removeTag}
                        onClick={() => removeBar(skill, i)}
                        disabled={saving === skill._id}
                        style={{ padding: '4px 8px' }}
                      >✕</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end' }}>
                  <input
                    type="text"
                    placeholder="Skill name..."
                    value={newBar[skill._id]?.label || ''}
                    onChange={(e) => setNewBar((prev) => ({ ...prev, [skill._id]: { ...prev[skill._id], label: e.target.value } }))}
                    className={styles.addInput}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Prof %"
                    value={newBar[skill._id]?.width ?? 50}
                    onChange={(e) => setNewBar((prev) => ({ ...prev, [skill._id]: { ...prev[skill._id], width: parseInt(e.target.value) || 50 } }))}
                    style={{ width: '70px', padding: '0.5rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)' }}
                  />
                  <button
                    className={styles.addBtn}
                    onClick={() => addBar(skill)}
                    disabled={saving === skill._id}
                  >+</button>
                </div>
              </div>
            </div>
          ))}

          {/* New Category Card */}
          <div className={`${styles.card} ${styles.newCatCard}`}>
            <div className={styles.catTitle} style={{ marginBottom: '1rem', color: 'var(--mint)' }}>
              + New Category
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  value={newCat.category}
                  onChange={(e) => setNewCat({ ...newCat, category: e.target.value })}
                  placeholder="e.g. DevOps"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Icon (Emoji/Symbol)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      value={newCat.icon}
                      onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                      placeholder="⚡"
                      maxLength={4}
                      style={{
                        fontSize: '1.1rem',
                        flex: 1,
                        padding: '0.6rem',
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        color: 'var(--text)',
                      }}
                    />
                    <a
                      href="https://emojipedia.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.6rem 1rem',
                        background: 'var(--border)',
                        color: 'var(--mint)',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        border: '1px solid var(--border)',
                      }}
                      title="Browse emojis online"
                    >
                      🔍 Find Emoji
                    </a>
                  </div>
                  <small style={{ color: 'var(--text3)', fontSize: '0.7rem' }}>
                    Copy-paste any emoji or symbol (up to 4 characters)
                  </small>
                </div>
                <div className="form-group">
                  <label>Accent Color</label>
                  <select
                    value={newCat.accentColor}
                    onChange={(e) => setNewCat({ ...newCat, accentColor: e.target.value })}
                    style={{
                      padding: '0.6rem',
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      color: 'var(--text)',
                    }}
                  >
                    <option value="mint">Mint</option>
                    <option value="gold">Gold</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={styles.btnCreate}>CREATE CATEGORY</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
