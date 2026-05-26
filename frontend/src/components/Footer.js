import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', link: '/' },
    { name: 'Listings', link: '/listings' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' }
  ];

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container">
        {/* Main Footer Content (moderate) */}
        <div className="footer-content footer-compact">
          {/* Brand Section */}
          <motion.div 
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <div className="logo-icon">
                <i className="fas fa-home"></i>
              </div>
              <div className="logo-text">
                <h3>Propex</h3>
                <span className="footer-tagline">Pakistan's Leading Real Estate Platform</span>
              </div>
            </div>
            <p className="footer-description">
              Revolutionizing Pakistan's real estate market with AI-powered technology,
              transparent processes, and exceptional service. Your trusted partner in
              finding the perfect property.
            </p>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>Quick Links</h4>
            <nav className="footer-nav">
              {quickLinks.map((link, index) => (
                <a key={index} href={link.link} className="footer-link">
                  <i className="fas fa-arrow-right"></i>
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Contact & Newsletter Section */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4>Stay Connected</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <div>
                  <strong>Call Us</strong>
                  <span>+92 51 1111 2222</span>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <strong>Email Us</strong>
                  <span>info@propex.com</span>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Head Office</strong>
                  <span>Blue Area, F-7 Markaz, Islamabad</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="newsletter">
              <h5>Newsletter</h5>
              <p>Get the latest property updates and market insights</p>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Offices section removed; only Islamabad retained in contact info */}

        {/* Social Links */}
        <motion.div 
          className="footer-social"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="social-links">
            <a href="#facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#twitter" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#linkedin" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-content">
            <div className="footer-legal">
              <p>&copy; {currentYear} Propex Pakistan. All rights reserved.</p>
              <div className="legal-links">
                <a href="/privacy" className="legal-link">Privacy</a>
                <a href="/terms" className="legal-link">Terms</a>
                <a href="/disclaimer" className="legal-link">Disclaimer</a>
              </div>
            </div>
            
            <div className="footer-certifications">
              <div className="footer-badges">
                <div className="footer-badge">
                  <i className="fas fa-shield-check"></i>
                  <span>SSL Secured</span>
                </div>
                <div className="footer-badge">
                  <i className="fas fa-award"></i>
                  <span>Trusted Platform</span>
                </div>
                <div className="footer-badge">
                  <i className="fas fa-clock"></i>
                  <span>24/7 Support</span>
                </div>
                <div className="footer-badge">
                  <i className="fas fa-mobile-alt"></i>
                  <span>Mobile Friendly</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Disclaimer removed for compactness */}
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;