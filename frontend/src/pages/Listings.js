import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Listings.css';

const API = 'http://localhost:5000';

const CATEGORY_ICONS = {
  all: '🏠', house: '🏡', villa: '🏘️', penthouse: '🏢', apartment: '🏬'
};

const Listings = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbProperties, setDbProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    pageTitle: "Premium Properties in Islamabad",
    pageSubtitle: "Discover luxury homes in Pakistan's capital city",
    bannerImageUrl: ""
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [propsRes, settingsRes] = await Promise.all([
          axios.get(`${API}/api/properties`),
          axios.get(`${API}/api/settings/listing`).catch(() => null)
        ]);
        setDbProperties(propsRes.data.data || []);
        if (settingsRes?.data?.data) {
          setSettings(settingsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const types = ['all', ...new Set(dbProperties.map(p => p.property_type).filter(Boolean))];
  const categories = types.map(key => ({
    key,
    label: key === 'all' ? 'All Properties' : key.charAt(0).toUpperCase() + key.slice(1),
    icon: CATEGORY_ICONS[key] || '🏠'
  }));

  const getFilteredProperties = () => {
    if (activeCategory === 'all') return dbProperties;
    return dbProperties.filter(p => (p.property_type || '').toLowerCase() === activeCategory);
  };

  const filtered = getFilteredProperties();

  const typeGradients = {
    villa: 'linear-gradient(135deg, #1a3a1a, #2d5a27)',
    penthouse: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)',
    apartment: 'linear-gradient(135deg, #4a3728, #7c5e4a)',
    house: 'linear-gradient(135deg, #2d1a3a, #5a2d7c)',
  };

  return (
    <div className="listings-page">
      {/* Hero Banner */}
      <div
        className="listings-hero"
        style={{
          background: settings.bannerImageUrl
            ? `url(${settings.bannerImageUrl}) center/cover no-repeat`
            : 'linear-gradient(135deg, #0f2010 0%, #1a3620 50%, #0d1f0d 100%)'
        }}
      >
        {settings.bannerImageUrl && <div className="listings-hero-overlay" />}
        <motion.div
          className="listings-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="listings-eyebrow">🏙️ Pakistan Real Estate</div>
          <h1>{settings.pageTitle}</h1>
          <p>{settings.pageSubtitle}</p>
          <div className="listings-hero-stats">
            <div className="lh-stat"><strong>{dbProperties.length}</strong><span>Properties</span></div>
            <div className="lh-stat"><strong>{categories.length - 1}</strong><span>Types</span></div>
            <div className="lh-stat"><strong>4.9⭐</strong><span>Rating</span></div>
          </div>
        </motion.div>
      </div>

      <div className="container">
        {/* Category Tabs */}
        <motion.div
          className="category-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.key}
              className={`category-tab ${activeCategory === category.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.key)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
              <span className="category-count">
                {category.key === 'all'
                  ? dbProperties.length
                  : dbProperties.filter(p => p.property_type === category.key).length}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Results count */}
        <motion.div
          className="listings-results-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span>{loading ? 'Loading…' : `${filtered.length} propert${filtered.length !== 1 ? 'ies' : 'y'} found`}</span>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="properties-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loading && (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="listings-skeleton-card">
                  <div className="listings-skeleton-img" />
                  <div style={{ padding: 20 }}>
                    <div className="listings-skeleton" style={{ height: 16, width: '70%', marginBottom: 10 }} />
                    <div className="listings-skeleton" style={{ height: 12, width: '45%' }} />
                  </div>
                </div>
              ))
            )}

            {!loading && filtered.length === 0 && (
              <div className="listings-empty">
                <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🏠</div>
                <h3>No {activeCategory !== 'all' ? activeCategory + 's' : 'properties'} found</h3>
                <p>Try selecting a different category.</p>
              </div>
            )}

            {!loading && filtered.map((property, index) => (
              <motion.div
                key={property.id}
                className="property-card listing-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div
                  className="property-image listing-image"
                  style={{
                    background: typeGradients[property.property_type] || typeGradients.house
                  }}
                >
                  {property.main_image_url ? (
                    <img
                      src={property.main_image_url}
                      alt={property.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <motion.div
                      className="property-placeholder"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <span style={{ fontSize: 48 }}>
                        {property.property_type === 'villa' ? '🏡' :
                         property.property_type === 'penthouse' ? '🏢' :
                         property.property_type === 'apartment' ? '🏬' : '🏠'}
                      </span>
                    </motion.div>
                  )}
                  <div className="property-type-badge">
                    {(property.property_type || 'Property').toUpperCase()}
                  </div>
                </div>

                <div className="property-info listing-info">
                  <h3 className="property-title">{property.title}</h3>
                  <div className="property-price listing-price">
                    {Number(property.price).toLocaleString()} <span style={{ fontSize: '0.7em', fontWeight: 600, color: '#6b7280' }}>PKR</span>
                  </div>
                  <div className="property-location">
                    📍 {property.address || property.area || 'Islamabad, Pakistan'}
                  </div>

                  <div className="property-features">
                    {property.bedrooms > 0 && (
                      <div className="feature-item">
                        <span className="feature-icon">🛏️</span>
                        <span>{property.bedrooms} Beds</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="feature-item">
                        <span className="feature-icon">🚿</span>
                        <span>{property.bathrooms} Baths</span>
                      </div>
                    )}
                    {property.area_sqft > 0 && (
                      <div className="feature-item">
                        <span className="feature-icon">📐</span>
                        <span>{property.area_sqft?.toLocaleString()} sqft</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Listings;
