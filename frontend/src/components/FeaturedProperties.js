import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeaturedProperties.css';

const API = 'http://localhost:5000';

const PropertyCard = ({ property, index }) => {
  const navigate = useNavigate();

  const typeGradients = {
    villa: 'linear-gradient(135deg, #2d5a27, #4a7c59)',
    penthouse: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)',
    apartment: 'linear-gradient(135deg, #4a3728, #7c5e4a)',
    house: 'linear-gradient(135deg, #3a2d4a, #6a4a7c)',
  };

  const typeIcons = {
    villa: '🏡', penthouse: '🏢', apartment: '🏬', house: '🏠'
  };

  const gradient = typeGradients[property.property_type] || typeGradients.house;
  const icon = typeIcons[property.property_type] || '🏠';

  return (
    <motion.div
      className="property-card fp-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      onClick={() => navigate(`/property/${property.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* Image */}
      <div className="property-image fp-image" style={{ background: gradient }}>
        {property.main_image_url ? (
          <img
            src={property.main_image_url}
            alt={property.title}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <motion.div
            className="fp-icon-placeholder"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span style={{ fontSize: 48 }}>{icon}</span>
          </motion.div>
        )}

        {/* Overlay gradient */}
        <div className="fp-img-overlay" />

        {/* Badges */}
        <div className="fp-badges">
          <span className="fp-type-badge">{property.property_type || 'Property'}</span>
          {index < 2 && <span className="fp-hot-badge">🔥 Hot Deal</span>}
        </div>

        {/* Price hover reveal */}
        <div className="fp-price-reveal">
          {Number(property.price).toLocaleString()} PKR
        </div>
      </div>

      {/* Info */}
      <div className="property-info fp-info">
        <h3 className="property-title fp-title">{property.title}</h3>

        <p className="property-location fp-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {property.address || property.area || 'Islamabad, Pakistan'}
        </p>

        <div className="property-details fp-details">
          {property.bedrooms > 0 && (
            <div className="detail-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="detail-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 6L20 6C20.5523 6 21 6.44772 21 7L21 20C21 20.5523 20.5523 21 20 21L4 21C3.44772 21 3 20.5523 3 20L3 4C3 3.44772 3.44772 3 4 3L7 3C7.55228 3 8 3.44772 8 4L8 5C8 5.55228 8.44772 6 9 6Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.area_sqft > 0 && (
            <div className="detail-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <rect x="7" y="7" width="3" height="9" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="7" width="3" height="5" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{property.area_sqft?.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        <div className="property-footer fp-footer">
          <div className="property-price fp-price">
            {Number(property.price).toLocaleString()} <span className="price-unit">PKR</span>
          </div>
          <button
            className="btn btn-outline view-btn fp-view-btn"
            onClick={e => { e.stopPropagation(); navigate(`/property/${property.id}`); }}
          >
            View →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/featured-properties`)
      .then(res => {
        setProperties(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to all properties
        axios.get(`${API}/api/properties`)
          .then(res => setProperties((res.data.data || []).slice(0, 6)))
          .catch(() => {})
          .finally(() => setLoading(false));
      });
  }, []);

  return (
    <section className="featured-properties section-padding">
      <div className="container">
        <motion.div
          className="section-header text-center mb-60"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="fp-section-eyebrow">⭐ Curated Selection</div>
          <h2 className="fp-section-title">Featured Properties</h2>
          <p className="fp-section-desc">
            Handpicked premium listings from the best locations in Islamabad and Rawalpindi
          </p>
        </motion.div>

        {loading ? (
          <div className="fp-skeleton-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="property-card fp-skeleton-card">
                <div className="fp-skeleton fp-skeleton-img" />
                <div style={{ padding: 20 }}>
                  <div className="fp-skeleton" style={{ height: 16, width: '70%', marginBottom: 10, borderRadius: 6 }} />
                  <div className="fp-skeleton" style={{ height: 12, width: '45%', borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="fp-empty">
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🏠</div>
            <p>No featured properties available yet.</p>
          </div>
        ) : (
          <div className="properties-grid grid grid-3">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        )}

        <motion.div
          className="text-center fp-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className="btn btn-primary fp-view-all-btn"
            onClick={() => navigate('/listings')}
            whileHover={{ scale: 1.04, y: -2, boxShadow: '0 10px 30px rgba(45,90,39,0.3)' }}
            whileTap={{ scale: 0.97 }}
          >
            View All Properties →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
