import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ImageUploader from './ImageUploader';

const API = 'http://localhost:5000';

const PROPERTY_TYPES = ['house', 'apartment', 'villa', 'penthouse'];

const emptyForm = {
  title: '', description: '', price: '',
  property_type: 'house', status: 'available',
  bedrooms: '', bathrooms: '', area_sqft: '',
  address: '', area: '', main_image_url: '',
  agent_name: '', agent_phone: ''
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

const AdminListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProp, setEditProp] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [listingSettings, setListingSettings] = useState({
    pageTitle: '', pageSubtitle: '', bannerImageUrl: ''
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [propsRes, settingsRes] = await Promise.all([
        axios.get(`${API}/api/properties`),
        axios.get(`${API}/api/settings/listing`).catch(() => ({ data: { data: {} } }))
      ]);
      setProperties(propsRes.data.data || []);
      const s = settingsRes.data.data || {};
      setListingSettings({
        pageTitle: s.pageTitle || 'Premium Properties in Islamabad',
        pageSubtitle: s.pageSubtitle || "Discover luxury homes in Pakistan's capital city",
        bannerImageUrl: s.bannerImageUrl || ''
      });
    } catch (e) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddModal = () => {
    setEditProp(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (prop) => {
    setEditProp(prop);
    setForm({
      title: prop.title || '',
      description: prop.description || '',
      price: prop.price || '',
      property_type: prop.property_type || 'house',
      status: prop.status || 'available',
      bedrooms: prop.bedrooms || '',
      bathrooms: prop.bathrooms || '',
      area_sqft: prop.area_sqft || '',
      address: prop.address || '',
      area: prop.area || '',
      main_image_url: prop.main_image_url || '',
      agent_name: prop.agent_name || '',
      agent_phone: prop.agent_phone || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.price) {
      showToast('Title and price are required', 'error');
      return;
    }
    try {
      setSaving(true);
      const payload = { ...form };
      if (editProp) {
        await axios.put(`${API}/api/properties/${editProp.id}`, payload);
        showToast('Property updated successfully');
      } else {
        await axios.post(`${API}/api/properties`, payload);
        showToast('New property added successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to save property', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/properties/${id}`);
      showToast('Property deleted');
      setDeleteConfirm(null);
      fetchData();
    } catch (e) {
      showToast('Failed to delete property', 'error');
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsSaving(true);
      await axios.put(`${API}/api/settings/listing`, listingSettings);
      showToast('Listing page settings saved');
    } catch (e) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSettingsSaving(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: e => setForm(p => ({ ...p, [key]: e.target.value }))
  });

  const filtered = properties.filter(p => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.area?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || p.property_type === filterType;
    return matchesSearch && matchesType;
  });

  const TABS = [
    { key: 'properties', label: '🏠 Properties', count: properties.length },
    { key: 'settings', label: '⚙️ Page Settings' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2>Property Listings</h2>
          <p>Manage all property listings and configure the listings page appearance.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
          ➕ Add Property
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid #e5e7eb', paddingBottom: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px', border: 'none',
              background: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              color: activeTab === tab.key ? '#2d5a27' : 'var(--admin-text-muted)',
              borderBottom: activeTab === tab.key ? '2px solid #4a7c59' : '2px solid transparent',
              marginBottom: -2, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                background: activeTab === tab.key ? 'rgba(74,124,89,0.15)' : '#f3f4f6',
                color: activeTab === tab.key ? '#2d5a27' : 'var(--admin-text-muted)',
                fontSize: '0.7rem', padding: '1px 7px',
                borderRadius: 20, fontWeight: 700
              }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <>
          {/* Filters */}
          <div className="admin-card" style={{ marginBottom: 20 }}>
            <div className="admin-card-body" style={{ padding: '14px 20px' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search by title, area, address…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      width: '100%', padding: '9px 12px 9px 36px',
                      border: '1.5px solid #e5e7eb', borderRadius: 8,
                      fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['all', ...PROPERTY_TYPES].map(t => (
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
                      {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3><span className="header-icon">🏘️</span> {filtered.length} Properties</h3>
            </div>
            <div className="admin-properties-table-wrap">
              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  Loading properties…
                </div>
              ) : filtered.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="empty-icon">🏠</div>
                  <h3>No properties found</h3>
                  <p>Try adjusting your search or add a new property.</p>
                  <button className="admin-btn admin-btn-primary" style={{ marginTop: 16 }} onClick={openAddModal}>
                    Add Property
                  </button>
                </div>
              ) : (
                <table className="admin-properties-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Specs</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(prop => (
                      <tr key={prop.id}>
                        <td>
                          <div className="table-prop-img">
                            {prop.main_image_url
                              ? <img src={prop.main_image_url} alt={prop.title} />
                              : <span>{
                                prop.property_type === 'villa' ? '🏡' :
                                prop.property_type === 'penthouse' ? '🏢' :
                                prop.property_type === 'apartment' ? '🏬' : '🏠'
                              }</span>
                            }
                          </div>
                        </td>
                        <td>
                          <div className="table-prop-title">{prop.title}</div>
                        </td>
                        <td>
                          <span className={`prop-type-badge ${prop.property_type || 'house'}`}>
                            {prop.property_type || 'house'}
                          </span>
                        </td>
                        <td>
                          <span className="table-prop-price">
                            {Number(prop.price).toLocaleString()} PKR
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                            {prop.bedrooms > 0 && `🛏 ${prop.bedrooms}  `}
                            {prop.bathrooms > 0 && `🚿 ${prop.bathrooms}`}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {prop.area || prop.address || '—'}
                          </div>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="admin-btn admin-btn-ghost admin-btn-sm"
                              onClick={() => openEditModal(prop)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => setDeleteConfirm(prop)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Live Preview */}
          <div className="settings-preview-banner" style={{ marginBottom: 24 }}>
            {listingSettings.bannerImageUrl && (
              <img src={listingSettings.bannerImageUrl} alt="banner preview" />
            )}
            <div className="settings-preview-overlay" />
            <div className="settings-preview-text">
              <h3>{listingSettings.pageTitle || 'Page Title'}</h3>
              <p>{listingSettings.pageSubtitle || 'Page subtitle will appear here'}</p>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3><span className="header-icon">⚙️</span> Listing Page Settings</h3>
            </div>
            <div className="admin-card-body">
              <div className="admin-form-grid admin-form-grid-settings" style={{ gridTemplateColumns: '1fr', gap: 20 }}>
                <div className="admin-field">
                  <label>Page Title</label>
                  <input
                    type="text"
                    placeholder="Premium Properties in Islamabad"
                    value={listingSettings.pageTitle}
                    onChange={e => setListingSettings(p => ({ ...p, pageTitle: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label>Page Subtitle</label>
                  <input
                    type="text"
                    placeholder="Discover luxury homes in Pakistan's capital city"
                    value={listingSettings.pageSubtitle}
                    onChange={e => setListingSettings(p => ({ ...p, pageSubtitle: e.target.value }))}
                  />
                </div>
                <div>
                  <ImageUploader
                    label="Banner Image (optional)"
                    value={listingSettings.bannerImageUrl}
                    onChange={url => setListingSettings(p => ({ ...p, bannerImageUrl: url }))}
                    hint="Leave blank to use the default gradient banner."
                    height={150}
                  />
                </div>
                <div>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-lg"
                    onClick={handleSaveSettings}
                    disabled={settingsSaving}
                  >
                    {settingsSaving ? '⏳ Saving…' : '💾 Save Page Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add / Edit Property Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              className="admin-modal"
              style={{ maxWidth: 640 }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <div className="admin-modal-header">
                <h3>{editProp ? '✏️ Edit Property' : '➕ Add New Property'}</h3>
                <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>

              <div className="admin-modal-body">
                {/* Image preview */}
                {form.main_image_url && (
                  <div style={{ marginBottom: 20 }}>
                    <img
                      src={form.main_image_url}
                      alt="preview"
                      style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="admin-section-label">Basic Info</div>
                <div className="admin-form-grid" style={{ marginBottom: 16 }}>
                  <div className="admin-field span-2">
                    <label>Title *</label>
                    <input type="text" placeholder="Modern Luxury Villa" {...field('title')} />
                  </div>
                  <div className="admin-field">
                    <label>Property Type</label>
                    <select {...field('property_type')}>
                      {PROPERTY_TYPES.map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Status</label>
                    <select {...field('status')}>
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>
                </div>

                <div className="admin-section-label">Specs & Pricing</div>
                <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 16 }}>
                  <div className="admin-field">
                    <label>Price (PKR) *</label>
                    <input type="number" placeholder="5000000" {...field('price')} />
                  </div>
                  <div className="admin-field">
                    <label>Bedrooms</label>
                    <input type="number" min="0" placeholder="4" {...field('bedrooms')} />
                  </div>
                  <div className="admin-field">
                    <label>Bathrooms</label>
                    <input type="number" min="0" placeholder="3" {...field('bathrooms')} />
                  </div>
                </div>

                <div className="admin-form-grid" style={{ marginBottom: 16 }}>
                  <div className="admin-field">
                    <label>Area (sqft)</label>
                    <input type="number" placeholder="3200" {...field('area_sqft')} />
                  </div>
                  <div className="admin-field">
                    <label>Region / Area</label>
                    <input type="text" placeholder="DHA Phase 6" {...field('area')} />
                  </div>
                  <div className="admin-field span-2">
                    <label>Full Address</label>
                    <input type="text" placeholder="Street 5, DHA Phase 6, Islamabad" {...field('address')} />
                  </div>
                </div>

                <div className="admin-section-label">Media</div>
                <div style={{ marginBottom: 16 }}>
                  <ImageUploader
                    label="Main Property Image"
                    value={form.main_image_url}
                    onChange={url => setForm(p => ({ ...p, main_image_url: url }))}
                    hint="Upload from your device or paste a direct image URL."
                    height={180}
                  />
                </div>

                <div className="admin-section-label">Description</div>
                <div className="admin-field" style={{ marginBottom: 16 }}>
                  <textarea
                    rows={4}
                    placeholder="Describe the property in detail…"
                    {...field('description')}
                  />
                </div>

                <div className="admin-section-label">Agent Info</div>
                <div className="admin-form-grid" style={{ marginBottom: 0 }}>
                  <div className="admin-field">
                    <label>Agent Name</label>
                    <input type="text" placeholder="Agent Name" {...field('agent_name')} />
                  </div>
                  <div className="admin-field">
                    <label>Agent Phone</label>
                    <input type="text" placeholder="+92 300 1234567" {...field('agent_phone')} />
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
                  {saving ? '⏳ Saving…' : editProp ? '💾 Update Property' : '➕ Add Property'}
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
              style={{ maxWidth: 420 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="admin-modal-header">
                <h3>🗑️ Delete Property?</h3>
                <button className="admin-modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
              </div>
              <div className="admin-modal-body">
                <p style={{ marginBottom: 8 }}>
                  You are about to permanently delete:
                </p>
                <div style={{
                  background: '#fef2f2', borderRadius: 8,
                  padding: '12px 16px', border: '1px solid #fee2e2'
                }}>
                  <strong style={{ color: '#991b1b' }}>{deleteConfirm.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: 4 }}>
                    {Number(deleteConfirm.price).toLocaleString()} PKR — {deleteConfirm.area || deleteConfirm.address}
                  </div>
                </div>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginTop: 12 }}>
                  This action cannot be undone.
                </p>
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
                <button
                  className="admin-btn admin-btn-orange"
                  onClick={() => handleDelete(deleteConfirm.id)}
                >
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

export default AdminListings;
