import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AuthModal.css';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    // Signup fields
    fullName: '',
    phone: '',
    confirmPassword: '',
    userType: 'buyer'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
      // Here you would handle actual login
      alert('Login functionality would be implemented here');
    }, 1500);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
      // Here you would handle actual signup
      alert('Signup functionality would be implemented here');
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phone: '',
      confirmPassword: '',
      userType: 'buyer'
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="auth-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="auth-modal"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>

          {/* Header */}
          <div className="auth-modal-header">
            <div className="modal-logo">
              <i className="fas fa-home"></i>
              <span>Propex</span>
            </div>
            <h2>Welcome to Pakistan's Premier Real Estate Platform</h2>
            <p>Join thousands of buyers and sellers</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
            >
              <i className="fas fa-sign-in-alt"></i>
              Login
            </button>
            <button 
              className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => handleTabChange('signup')}
            >
              <i className="fas fa-user-plus"></i>
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <div className="auth-forms">
            <AnimatePresence mode="wait">
              {activeTab === 'login' && (
                <motion.form 
                  key="login"
                  className="auth-form"
                  onSubmit={handleLogin}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="form-group">
                    <div className="input-group">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-group">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="remember-me">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                    <button type="button" className="forgot-password" onClick={() => {}}>Forgot Password?</button>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {activeTab === 'signup' && (
                <motion.form 
                  key="signup"
                  className="auth-form"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="form-group">
                    <div className="input-group">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-group">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-group">
                      <i className="fas fa-phone"></i>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <div className="input-group">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-group">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm Password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>I am a:</label>
                    <div className="user-type-options">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="userType"
                          value="buyer"
                          checked={formData.userType === 'buyer'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-checkmark"></span>
                        <i className="fas fa-search"></i>
                        Property Buyer
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="userType"
                          value="seller"
                          checked={formData.userType === 'seller'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-checkmark"></span>
                        <i className="fas fa-home"></i>
                        Property Seller
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="userType"
                          value="agent"
                          checked={formData.userType === 'agent'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-checkmark"></span>
                        <i className="fas fa-briefcase"></i>
                        Real Estate Agent
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="terms-agreement">
                      <input type="checkbox" required />
                      <span className="checkmark"></span>
                      I agree to the <button type="button" className="link-btn">Terms &amp; Conditions</button> and <button type="button" className="link-btn">Privacy Policy</button>
                    </label>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <div className="divider">
              <span>Or continue with</span>
            </div>
            <div className="social-buttons">
              <button className="social-btn google">
                <i className="fab fa-google"></i>
                Google
              </button>
              <button className="social-btn facebook">
                <i className="fab fa-facebook-f"></i>
                Facebook
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="auth-modal-footer">
            <p>
              {activeTab === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "
              }
              <button 
                className="switch-tab"
                onClick={() => handleTabChange(activeTab === 'login' ? 'signup' : 'login')}
              >
                {activeTab === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;