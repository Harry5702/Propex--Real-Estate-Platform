import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import analyticsTracker from '../utils/analytics';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { property } = location.state || {};

  // Track property view when component mounts
  useEffect(() => {
    if (property) {
      analyticsTracker.trackPropertyView(property.id, property.title);
      analyticsTracker.trackPageVisit(`${property.title} - Property Detail`, window.location.href);
    }
  }, [property]);

  if (!property) {
    return (
      <div className="property-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Property not found</h2>
            <button className="btn btn-primary" onClick={() => navigate('/listings')}>
              Back to Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleContactAgent = () => {
    // Simulate contact functionality
    alert(`Contact agent for ${property.title}. Phone: +92-51-123-4567`);
  };

  const handleScheduleViewing = () => {
    // Simulate scheduling functionality
    alert(`Schedule viewing request sent for ${property.title}. We'll contact you soon!`);
  };

  return (
    <div className="property-detail-page">
      <div className="container">
        {/* Back Button */}
        <motion.button
          className="back-button"
          onClick={() => navigate('/listings')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Listings
        </motion.button>

        <div className="property-detail-content">
          {/* Property Hero Section */}
          <motion.div
            className="property-hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div 
              className="property-hero-image"
              style={{ background: property.gradient }}
            >
              <div className="property-type-badge-large">
                {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
              </div>
              <motion.div 
                className="property-hero-icon"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {property.type === 'house' ? '🏠' : 
                 property.type === 'villa' ? '🏡' : 
                 property.type === 'penthouse' ? '🏢' : '🏬'}
              </motion.div>
            </div>
          </motion.div>

          {/* Property Information Grid */}
          <div className="property-info-grid">
            {/* Main Information */}
            <motion.div
              className="property-main-info"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="property-detail-title">{property.title}</h1>
              <div className="property-detail-price">{property.price}</div>
              <div className="property-detail-location">📍 {property.location}</div>
              
              <div className="property-quick-stats">
                <div className="stat-item">
                  <span className="stat-icon">🛏️</span>
                  <div>
                    <span className="stat-number">{property.bedrooms}</span>
                    <span className="stat-label">Bedrooms</span>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🚿</span>
                  <div>
                    <span className="stat-number">{property.bathrooms}</span>
                    <span className="stat-label">Bathrooms</span>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📐</span>
                  <div>
                    <span className="stat-number">{property.area}</span>
                    <span className="stat-label">Area</span>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🗓️</span>
                  <div>
                    <span className="stat-number">{property.yearBuilt}</span>
                    <span className="stat-label">Built</span>
                  </div>
                </div>
              </div>

              <div className="property-description">
                <h3>Description</h3>
                <p>{property.description}</p>
              </div>

              <div className="property-features-detail">
                <h3>Features & Amenities</h3>
                <div className="features-grid">
                  {property.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="feature-tag-detail"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      ✓ {feature}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              className="property-contact-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="agent-info">
                <div className="agent-avatar">
                  <span>👤</span>
                </div>
                <div className="agent-details">
                  <h4>Property Agent</h4>
                  <p>Islamabad Real Estate Expert</p>
                  <div className="agent-rating">
                    ⭐⭐⭐⭐⭐ <span>(4.9/5)</span>
                  </div>
                </div>
              </div>

              <div className="contact-actions">
                <motion.button
                  className="btn btn-primary contact-btn"
                  onClick={handleContactAgent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📞 Contact Agent
                </motion.button>
                
                <motion.button
                  className="btn btn-secondary contact-btn"
                  onClick={handleScheduleViewing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📅 Schedule Viewing
                </motion.button>
              </div>

              <div className="property-quick-contact">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+92-51-123-4567</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>agent@propex.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">💬</span>
                  <span>WhatsApp Available</span>
                </div>
              </div>

              <div className="property-share">
                <h4>Share Property</h4>
                <div className="share-buttons">
                  <button className="share-btn facebook">📘</button>
                  <button className="share-btn twitter">🐦</button>
                  <button className="share-btn whatsapp">💬</button>
                  <button className="share-btn copy">🔗</button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Information */}
          <motion.div
            className="property-additional-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="info-tabs">
              <div className="info-tab active">
                <h3>Location Benefits</h3>
                <ul>
                  <li>🏪 Near to main markets and shopping centers</li>
                  <li>🏥 Close to major hospitals</li>
                  <li>🎓 Proximity to top schools and universities</li>
                  <li>🚌 Easy access to public transportation</li>
                  <li>🛣️ Well-connected road network</li>
                  <li>🏛️ Government offices nearby</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;