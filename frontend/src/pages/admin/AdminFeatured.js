import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:5000';

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

const AdminFeatured = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [hasChanges, setHasChanges] = useState(false);
  const [initialIds, setInitialIds] = useState([]);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [propsRes, featuredRes] = await Promise.all([
        axios.get(`${API}/api/properties`),
        axios.get(`${API}/api/featured-properties`)
      ]);
      setAllProperties(propsRes.data.data || []);
      const ids = (featuredRes.data.featuredIds || []).map(Number);
      setSelectedIds(ids);
      setInitialIds(ids);
    } catch (e) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const changed =
      selectedIds.length !== initialIds.length ||
      selectedIds.some(id => !initialIds.includes(id));
    setHasChanges(changed);
  }, [selectedIds, initialIds]);

  const toggleProperty = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API}/api/featured-properties`, { ids: selectedIds });
      setInitialIds([...selectedIds]);
      setHasChanges(false);
      showToast(`Featured list updated — ${selectedIds.length} properties selected`);
    } catch (e) {
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedIds([...initialIds]);
    setHasChanges(false);
  };

  const filtered = allProperties.filter(p => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.area?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || p.property_type === filterType;
    return matchesSearch && matchesType;
  });

  const types = ['all', ...new Set(allProperties.map(p => p.property_type).filter(Boolean))];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2>Featured Properties</h2>
          <p>Select which properties appear in the "Featured Properties" section on the homepage.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {hasChanges && (
            <button className="admin-btn admin-btn-ghost" onClick={handleReset}>
              ↩️ Reset
            </button>
          )}
          <button
            className={`admin-btn ${hasChanges ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            {saving ? '⏳ Saving…' : hasChanges ? '💾 Save Changes' : '✅ Saved'}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap'
      }}>
        {[
          { label: 'Total Properties', value: allProperties.length, color: '#4a7c59' },
          { label: 'Featured Selected', value: selectedIds.length, color: '#ff6b35' },
          { label: 'Showing', value: filtered.length, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 10,
            padding: '12px 20px', border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Info tip */}
      <div style={{
        background: 'rgba(255,107,53,0.06)',
        border: '1px solid rgba(255,107,53,0.2)',
        borderRadius: 10, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 24, fontSize: '0.85rem', color: '#7c2d12'
      }}>
        <span>⭐</span>
        <span>
          <strong>Tip:</strong> Select up to 6 properties to feature. If none are selected, the latest 6 properties will be shown automatically.
        </span>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-body" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', fontSize: 16
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search properties…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px 9px 38px',
                  border: '1.5px solid #e5e7eb', borderRadius: 8,
                  fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  style={{
                    padding: '7px 14px', borderRadius: 8,
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                    border: filterType === t ? '2px solid #4a7c59' : '1.5px solid #e5e7eb',
                    background: filterType === t ? 'rgba(74,124,89,0.1)' : 'white',
                    color: filterType === t ? '#2d5a27' : 'var(--admin-text-muted)',
                    textTransform: 'capitalize', transition: 'all 0.2s'
                  }}
                >
                  {t === 'all' ? '🏠 All' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            {selectedIds.length > 0 && (
              <button
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setSelectedIds([])}
              >
                Clear All ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="featured-select-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="admin-card">
              <div className="admin-skeleton" style={{ height: 130 }} />
              <div style={{ padding: 12 }}>
                <div className="admin-skeleton" style={{ height: 14, marginBottom: 8, width: '80%' }} />
                <div className="admin-skeleton" style={{ height: 12, width: '50%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No properties found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="featured-select-grid">
          {filtered.map((prop, index) => {
            const isSelected = selectedIds.includes(prop.id);
            return (
              <motion.div
                key={prop.id}
                className={`featured-prop-card ${isSelected ? 'selected' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => toggleProperty(prop.id)}
              >
                {isSelected && (
                  <div className="selected-badge">✓</div>
                )}
                <div
                  className="featured-prop-img"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #2d5a27, #4a7c59)'
                      : 'linear-gradient(135deg, #374151, #6b7280)'
                  }}
                >
                  {prop.main_image_url ? (
                    <img src={prop.main_image_url} alt={prop.title} />
                  ) : (
                    <span>{
                      prop.property_type === 'villa' ? '🏡' :
                      prop.property_type === 'penthouse' ? '🏢' :
                      prop.property_type === 'apartment' ? '🏬' : '🏠'
                    }</span>
                  )}
                </div>
                <div className="featured-prop-info">
                  <div className="prop-type">{prop.property_type || 'Property'}</div>
                  <h4>{prop.title}</h4>
                  <div className="prop-price">
                    {Number(prop.price).toLocaleString()} PKR
                  </div>
                  {(prop.bedrooms || prop.bathrooms) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: 4 }}>
                      {prop.bedrooms > 0 && `🛏 ${prop.bedrooms} `}
                      {prop.bathrooms > 0 && `🚿 ${prop.bathrooms} `}
                      {prop.area_sqft > 0 && `📐 ${prop.area_sqft} sqft`}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Floating Save Bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            style={{
              position: 'fixed', bottom: 24, left: '50%',
              transform: 'translateX(-50%)',
              background: '#1a2e1a', color: 'white',
              padding: '14px 28px', borderRadius: 50,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', gap: 16,
              zIndex: 100, minWidth: 360, justifyContent: 'space-between',
              border: '1px solid rgba(74,124,89,0.4)'
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>
              ⭐ <strong>{selectedIds.length}</strong> properties selected
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '8px 16px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.1)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 600
                }}
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 20px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #4a7c59, #2d5a27)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(74,124,89,0.4)'
                }}
              >
                {saving ? '⏳ Saving…' : '💾 Save'}
              </button>
            </div>
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

export default AdminFeatured;
