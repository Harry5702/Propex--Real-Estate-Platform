import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:5000';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' }
  })
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProps, setRecentProps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, propsRes] = await Promise.all([
          axios.get(`${API}/api/admin/stats`),
          axios.get(`${API}/api/properties?limit=5`)
        ]);
        setStats(statsRes.data.data);
        setRecentProps(propsRes.data.data || []);
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STAT_CARDS = [
    {
      icon: '🏠',
      label: 'Total Properties',
      value: stats?.totalProperties ?? '—',
      color: 'green',
      change: 'Live listings'
    },
    {
      icon: '⭐',
      label: 'Featured Properties',
      value: stats?.featuredCount ?? '—',
      color: 'orange',
      change: 'Highlighted on homepage'
    },
    {
      icon: '🎬',
      label: 'Hero Slides',
      value: stats?.heroSlidesCount ?? '—',
      color: 'blue',
      change: 'Active carousel slides'
    },
    {
      icon: '🏡',
      label: 'Property Types',
      value: stats?.byType?.length ?? '—',
      color: 'purple',
      change: 'Categories available'
    }
  ];

  const QUICK_LINKS = [
    {
      icon: '🖼️',
      title: 'Edit Hero Section',
      desc: 'Add, remove or update carousel slides',
      link: '/admin/hero',
      color: '#4a7c59'
    },
    {
      icon: '⭐',
      title: 'Manage Featured',
      desc: 'Choose which properties to spotlight',
      link: '/admin/featured',
      color: '#ff6b35'
    },
    {
      icon: '➕',
      title: 'Add Property',
      desc: 'Create a new property listing',
      link: '/admin/listings',
      color: '#3b82f6'
    },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            className={`admin-stat-card ${card.color}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="admin-stat-icon">{card.icon}</div>
            <div className="admin-stat-info">
              <h3>{loading ? '…' : card.value}</h3>
              <p>{card.label}</p>
              <p style={{ fontSize: '0.7rem', marginTop: 2, color: 'var(--admin-text-muted)' }}>
                {card.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Recent Properties */}
        <motion.div
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="admin-card-header">
            <h3><span className="header-icon">🏘️</span> Recent Properties</h3>
            <Link to="/admin/listings" className="admin-btn admin-btn-ghost admin-btn-sm">
              View All →
            </Link>
          </div>
          <div className="admin-properties-table-wrap">
            <table className="admin-properties-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    Loading…
                  </td></tr>
                ) : recentProps.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    No properties found. Add your first listing!
                  </td></tr>
                ) : recentProps.map(prop => (
                  <tr key={prop.id}>
                    <td>
                      <div className="table-prop-img">
                        {prop.main_image_url
                          ? <img src={prop.main_image_url} alt={prop.title} />
                          : <span>🏠</span>
                        }
                      </div>
                    </td>
                    <td>
                      <div className="table-prop-title">{prop.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {prop.area || prop.address || '—'}
                      </div>
                    </td>
                    <td>
                      <span className={`prop-type-badge ${prop.property_type || 'house'}`}>
                        {prop.property_type || 'Property'}
                      </span>
                    </td>
                    <td>
                      <span className="table-prop-price">
                        {Number(prop.price).toLocaleString()} PKR
                      </span>
                    </td>
                    <td>
                      <Link
                        to="/admin/listings"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="admin-card" style={{ marginBottom: 20 }}>
            <div className="admin-card-header">
              <h3><span className="header-icon">⚡</span> Quick Actions</h3>
            </div>
            <div className="admin-card-body" style={{ padding: 16 }}>
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.link}
                  to={item.link}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 12px', borderRadius: 10,
                    border: '1px solid #f0f0f0', marginBottom: 10,
                    transition: 'all 0.2s', cursor: 'pointer',
                    background: '#fff'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = item.color + '40';
                    e.currentTarget.style.background = item.color + '08';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: item.color + '15',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 20, flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--admin-text)', marginBottom: 2 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Property by Type */}
          {stats?.byType?.length > 0 && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3><span className="header-icon">📈</span> By Type</h3>
              </div>
              <div className="admin-card-body">
                {stats.byType.map(t => (
                  <div key={t.property_type} style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: 12
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`prop-type-badge ${t.property_type}`}>
                        {t.property_type}
                      </span>
                    </span>
                    <strong style={{ color: 'var(--admin-text)' }}>{t.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
