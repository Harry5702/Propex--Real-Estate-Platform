import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-logo">
            <span className="logo-text">Propex</span>
          </Link>
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/listings" className="nav-link">Listings</Link></li>
            <li><Link to="/about" className="nav-link">About Us</Link></li>
            <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
          </ul>
        </div>
        
        <div className="navbar-actions">
          <button className="search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className="btn btn-primary buy-sell-btn" 
            onClick={() => setShowAuthModal(true)}
          >
            <i className="fas fa-home"></i>
            Buy/Sell
          </button>

          <Link to="/admin" className="admin-icon-btn" title="Admin Panel" style={{ marginLeft: '15px', color: '#ff6b35', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </div>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  );
};

export default Navbar;