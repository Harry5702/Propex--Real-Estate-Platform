import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ImageUploader from './ImageUploader';

const API = 'http://localhost:5000';

const GRADIENT_OPTIONS = [
  { label: 'Forest Green', value: 'linear-gradient(135deg, #2d5a27, #4a7c59)' },
  { label: 'Sunset Orange', value: 'linear-gradient(135deg, #ff6b35, #d4af37)' },
  { label: 'Ocean Blue', value: 'linear-gradient(135deg, #1e40af, #0ea5e9)' },
  { label: 'Royal Purple', value: 'linear-gradient(135deg, #7c3aed, #c026d3)' },
  { label: 'Rose Gold', value: 'linear-gradient(135deg, #be185d, #f59e0b)' },
  { label: 'Deep Teal', value: 'linear-gradient(135deg, #0f766e, #14b8a6)' },
];

const ICON_OPTIONS = ['🏡', '🏢', '🏠', '🏘️', '🏗️', '🌆', '🏙️', '🌇'];

const emptyForm = {
  title: '',
  subtitle: '',
  price: '',
  location: '',
  features: '',
  gradient: GRADIENT_OPTIONS[0].value,
  image_url: '',
  icon: '🏡'
};

const Toast = ({ msg, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`admin-toast ${type === 'error' ? 'error' : ''}`}>
      {type === 'error' ? '❌' : '✅'} {msg}
    </div>
  );
};

const AdminHero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/hero-slides`);
      setSlides(res.data.data || []);
    } catch (e) {
      showToast('Failed to load slides', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  const openAddModal = () => {
    setEditSlide(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (slide) => {
    setEditSlide(slide);
    setForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      price: slide.price || '',
      location: slide.location || '',
      features: Array.isArray(slide.features) ? slide.features.join(', ') : (slide.features || ''),
      gradient: slide.gradient || GRADIENT_OPTIONS[0].value,
      image_url: slide.image_url || '',
      icon: slide.icon || '🏡'
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    try {
      setSaving(true);
      const payload = {
        ...form,
        features: form.features.split(',').map(f => f.trim()).filter(Boolean)
      };
      if (editSlide) {
        await axios.put(`${API}/api/hero-slides/${editSlide.id}`, payload);
        showToast('Slide updated successfully');
      } else {
        await axios.post(`${API}/api/hero-slides`, payload);
        showToast('New slide added successfully');
      }
      setShowModal(false);
      fetchSlides();
    } catch (e) {
      showToast('Failed to save slide', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/hero-slides/${id}`);
      showToast('Slide deleted');
      setDeleteConfirm(null);
      fetchSlides();
    } catch (e) {
      showToast('Failed to delete', 'error');
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: e => setForm(p => ({ ...p, [key]: e.target.value }))
  });

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2>Hero Section Management</h2>
          <p>Manage the carousel slides shown on the homepage hero section. Changes reflect instantly on the frontend.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
          <span>➕</span> Add New Slide
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(74,124,89,0.08), rgba(45,90,39,0.05))',
        border: '1px solid rgba(74,124,89,0.2)',
        borderRadius: 12, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 28, fontSize: '0.875rem', color: '#1a2e1a'
      }}>
        <span style={{ fontSize: 24 }}>💡</span>
        <div>
          <strong>Live Sync:</strong> Any changes you make here will immediately be reflected in the homepage hero carousel.
          You can add images via URL or leave blank to use beautiful gradient backgrounds.
        </div>
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="hero-slides-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="hero-slide-card">
              <div className="admin-skeleton" style={{ height: 160 }} />
              <div style={{ padding: 16 }}>
                <div className="admin-skeleton" style={{ height: 16, marginBottom: 8, width: '70%' }} />
                <div className="admin-skeleton" style={{ height: 12, width: '45%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="admin-empty-state">
          <div className="empty-icon">🖼️</div>
          <h3>No slides yet</h3>
          <p>Add your first hero slide to get started.</p>
          <button className="admin-btn admin-btn-primary" style={{ marginTop: 16 }} onClick={openAddModal}>
            Add First Slide
          </button>
        </div>
      ) : (
        <div className="hero-slides-grid">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="hero-slide-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <div
                className="hero-slide-preview"
                style={{ background: slide.gradient || GRADIENT_OPTIONS[0].value }}
              >
                {slide.image_url ? (
                  <img src={slide.image_url} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                ) : (
                  <span style={{ fontSize: 52, zIndex: 2 }}>{slide.icon || '🏠'}</span>
                )}
                <div className="slide-number">{index + 1}</div>
              </div>

              <div className="hero-slide-body">
                <h4>{slide.title}</h4>
                {slide.subtitle && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 6 }}>
                    {slide.subtitle}
                  </p>
                )}
                <div className="slide-price">{slide.price}</div>
                <div className="slide-location">📍 {slide.location}</div>
                <div className="slide-features">
                  {(Array.isArray(slide.features) ? slide.features : []).map((f, i) => (
                    <span key={i} className="slide-feature-tag">{f}</span>
                  ))}
                </div>
              </div>

              <div className="hero-slide-actions">
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => openEditModal(slide)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => setDeleteConfirm(slide.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              className="admin-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="admin-modal-header">
                <h3>
                  {editSlide ? '✏️ Edit Slide' : '➕ New Hero Slide'}
                </h3>
                <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>

              <div className="admin-modal-body">
                {/* Live Preview */}
                <div style={{
                  height: 120, borderRadius: 10, marginBottom: 20,
                  background: form.gradient, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden'
                }}>
                  {form.image_url && (
                    <img src={form.image_url} alt="preview"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <span style={{ fontSize: 36 }}>{form.icon}</span>
                    <div style={{ color: 'white', fontWeight: 700, marginTop: 4, fontSize: '0.875rem' }}>
                      {form.title || 'Slide Title'}
                    </div>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-field span-2">
                    <label>Slide Title *</label>
                    <input type="text" placeholder="Modern Luxury Villa" {...field('title')} />
                  </div>
                  <div className="admin-field span-2">
                    <label>Subtitle</label>
                    <input type="text" placeholder="Experience premium living…" {...field('subtitle')} />
                  </div>
                  <div className="admin-field">
                    <label>Price</label>
                    <input type="text" placeholder="PKR 4.5 Crore" {...field('price')} />
                  </div>
                  <div className="admin-field">
                    <label>Location</label>
                    <input type="text" placeholder="DHA Phase 6, Islamabad" {...field('location')} />
                  </div>
                  <div className="admin-field span-2">
                    <label>Features (comma separated)</label>
                    <input type="text" placeholder="4 Beds, 3 Baths, 3,200 sq ft" {...field('features')} />
                  </div>
                  <div className="admin-field span-2">
                    <ImageUploader
                      label="Slide Image (optional — leave blank for gradient)"
                      value={form.image_url}
                      onChange={url => setForm(p => ({ ...p, image_url: url }))}
                      hint="Upload from your device or paste a URL. If blank, gradient background is used."
                      height={140}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Background Gradient</label>
                    <select {...field('gradient')}>
                      {GRADIENT_OPTIONS.map(g => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Icon / Emoji</label>
                    <select {...field('icon')}>
                      {ICON_OPTIONS.map(ico => (
                        <option key={ico} value={ico}>{ico} {ico}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? '⏳ Saving…' : editSlide ? '💾 Update Slide' : '➕ Add Slide'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="admin-modal"
              style={{ maxWidth: 400 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="admin-modal-header">
                <h3>🗑️ Delete Slide?</h3>
                <button className="admin-modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
              </div>
              <div className="admin-modal-body">
                <p style={{ color: 'var(--admin-text-muted)' }}>
                  This will permanently remove the slide from the hero carousel. This action cannot be undone.
                </p>
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="admin-btn admin-btn-orange" onClick={() => handleDelete(deleteConfirm)}>
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHero;
