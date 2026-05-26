import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Started with a vision to digitize Pakistani real estate' },
    { year: '2021', title: 'AI Integration', description: 'Launched AI-powered property valuation system' },
    { year: '2022', title: '10,000 Properties', description: 'Reached milestone of 10,000+ listed properties' },
    { year: '2023', title: 'Market Leader', description: 'Became Pakistan\'s leading property technology platform' },
    { year: '2024', title: 'Global Expansion', description: 'Expanding services to international markets' }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Mission Section */}
        <motion.section 
          className="mission-section centered"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="mission-title centered-title"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our Mission
          </motion.h2>
          <div className="mission-content">
            <div className="mission-text">
              <p>At Propex, we're revolutionizing Pakistan's real estate industry by combining cutting-edge AI technology with personalized service. Our mission is to make property buying, selling, and renting accessible, transparent, and efficient for every Pakistani.</p>
              <p>We believe everyone deserves a home, and we're here to make that dream a reality through innovative technology and exceptional service.</p>
              <div className="mission-features">
                <div className="feature">
                  <i className="fas fa-robot"></i>
                  <span>AI-Powered Valuations</span>
                </div>
                <div className="feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Transactions</span>
                </div>
                <div className="feature">
                  <i className="fas fa-chart-bar"></i>
                  <span>Market Analytics</span>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <motion.div 
                className="mission-visual"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="mission-icon-container">
                  <i className="fas fa-home-heart"></i>
                  <div className="mission-icon-bg">
                    <i className="fas fa-bullseye"></i>
                  </div>
                </div>
                <div className="mission-decorative-elements">
                  <div className="floating-element element-1">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <div className="floating-element element-2">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="floating-element element-3">
                    <i className="fas fa-heart"></i>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <section className="values-section">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          <div className="values-grid">
            <motion.div 
              className="value-item"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Innovation</h3>
              <p>Leveraging advanced AI and machine learning for accurate property valuations and smart recommendations tailored to Pakistani market conditions.</p>
            </motion.div>
            <motion.div 
              className="value-item"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="value-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Transparency</h3>
              <p>Providing clear, honest information about every property, market trends, and transaction costs with no hidden fees or surprises.</p>
            </motion.div>
            <motion.div 
              className="value-item"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="value-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Excellence</h3>
              <p>Delivering exceptional service and results for all our clients through continuous improvement and dedication to customer satisfaction.</p>
            </motion.div>
            <motion.div 
              className="value-item"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Trust</h3>
              <p>Building lasting relationships through reliable service, secure transactions, and consistent delivery on our promises to every client.</p>
            </motion.div>
            <motion.div 
              className="value-item"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community</h3>
              <p>Supporting Pakistani communities by making real estate accessible and contributing to sustainable urban development across the country.</p>
            </motion.div>
            <motion.div 
              className="value-item"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="value-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Sustainability</h3>
              <p>Promoting eco-friendly properties and sustainable development practices for a greener future in Pakistan's real estate landscape.</p>
            </motion.div>
          </div>
        </section>

        {/* Leadership section removed per request */}

        {/* Journey/Timeline Section */}
        <section className="journey-section">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Journey
          </motion.h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="timeline-item"
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="timeline-date">{milestone.year}</div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <motion.section 
          className="why-choose-section"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>Why Choose Propex?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h3>Local Expertise</h3>
              <p>Deep understanding of Pakistani real estate markets from Karachi to Islamabad</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile First</h3>
              <p>Seamless experience across all devices with our responsive platform</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Quick Processing</h3>
              <p>Fast property listings, instant valuations, and rapid transaction processing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h3>Secure Platform</h3>
              <p>Bank-grade security for all transactions and personal information</p>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          className="cta-section"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="cta-content">
            <h2>Ready to Find Your Dream Property?</h2>
            <p>Join thousands of satisfied customers who found their perfect home through Propex</p>
            <div className="cta-buttons">
              <motion.button
                className="cta-btn primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-search"></i>
                Start Property Search
              </motion.button>
              <motion.button
                className="cta-btn secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-plus"></i>
                List Your Property
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;