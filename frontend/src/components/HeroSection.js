import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HeroSection.css';

const API = 'http://localhost:5000';

const DEFAULT_SLIDES = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    subtitle: "Experience premium living in the heart of Islamabad",
    price: "PKR 4.5 Crore",
    location: "DHA Phase 6, Islamabad",
    features: ["4 Beds", "3 Baths", "3,200 sq ft"],
    gradient: "linear-gradient(135deg, #2d5a27, #4a7c59)",
    image_url: "",
    icon: "🏡"
  },
  {
    id: 2,
    title: "Premium Penthouse",
    subtitle: "Sky-high living with panoramic city views",
    price: "PKR 8 Crore",
    location: "Bahria Town, Rawalpindi",
    features: ["3 Beds", "2 Baths", "2,100 sq ft"],
    gradient: "linear-gradient(135deg, #ff6b35, #d4af37)",
    image_url: "",
    icon: "🏢"
  },
  {
    id: 3,
    title: "Luxury Apartment",
    subtitle: "Contemporary design meets elegant comfort",
    price: "PKR 2.5 Crore",
    location: "F-10, Islamabad",
    features: ["2 Beds", "2 Baths", "1,800 sq ft"],
    gradient: "linear-gradient(135deg, #4a7c59, #2d5a27)",
    image_url: "",
    icon: "🏠"
  }
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  useEffect(() => {
    setIsVisible(true);
    // Fetch slides from API
    axios.get(`${API}/api/hero-slides`)
      .then(res => {
        const data = res.data.data;
        if (data && data.length > 0) setSlides(data);
      })
      .catch(() => { /* Fall back to DEFAULT_SLIDES */ });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="hero-section">
      {/* Animated Background */}
      <div className="hero-background">
        <motion.div
          className="gradient-orb orb-1"
          animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="gradient-orb orb-2"
          animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 0.85, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="gradient-orb orb-3"
          animate={{ x: [0, 40, 0], y: [0, -70, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container hero-content">
        {/* Left: Text */}
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="hero-eyebrow">
            <span className="hero-eyebrow-badge">🇵🇰 Pakistan's #1 Real Estate Platform</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-title">
            Find Your Dream Home with{' '}
            <motion.span
              className="highlight"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Propex
            </motion.span>
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-description">
            Discover premium properties with AI-powered price prediction
            and expert real estate guidance. Your perfect home awaits.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-trust-row">
            {[
              { icon: '🏆', text: '500+ Properties' },
              { icon: '⭐', text: '4.9 Rating' },
              { icon: '👥', text: '2000+ Happy Clients' },
            ].map((item) => (
              <div key={item.text} className="hero-trust-item">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="hero-buttons">
            <motion.button
              className="btn btn-primary hero-btn-rounded"
              onClick={() => navigate('/listings')}
              whileHover={{ scale: 1.05, y: -3, boxShadow: "0 15px 35px rgba(45,90,39,0.4)" }}
              whileTap={{ scale: 0.96 }}
            >
              🏠 Explore Properties
            </motion.button>

            <motion.button
              className="btn btn-secondary hero-btn-rounded"
              whileHover={{ scale: 1.05, y: -3, boxShadow: "0 15px 35px rgba(255,107,53,0.4)" }}
              whileTap={{ scale: 0.96 }}
            >
              🤖 AI Price Predictor
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="scroll-indicator">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              ↓ Scroll to explore
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: Property Card Carousel */}
        <motion.div
          className="hero-showcase"
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <div className="compact-property-carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="compact-property-card"
                initial={{ opacity: 0, rotateX: 40, y: 24 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: -30, y: -20 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.02, rotateY: 3, transition: { duration: 0.3 } }}
              >
                {/* Card Image */}
                <div
                  className="compact-property-image"
                  style={{ background: slide.gradient || 'linear-gradient(135deg, #2d5a27, #4a7c59)' }}
                >
                  {slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <motion.div
                      className="property-icon"
                      animate={{ y: [0, -10, 0], rotate: [0, 4, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {slide.icon || '🏠'}
                    </motion.div>
                  )}

                  <motion.div
                    className="featured-badge"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 280 }}
                  >
                    ⭐ Featured
                  </motion.div>
                </div>

                {/* Card Info */}
                <motion.div
                  className="compact-property-info"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3 className="compact-title">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="compact-subtitle">{slide.subtitle}</p>
                  )}
                  <div className="compact-price">{slide.price}</div>
                  <div className="compact-location">📍 {slide.location}</div>

                  <div className="compact-features">
                    {(Array.isArray(slide.features) ? slide.features : []).map((feature, index) => (
                      <motion.span
                        key={index}
                        className="compact-feature-tag"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.08, type: "spring", stiffness: 300 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dots */}
            {slides.length > 1 && (
              <motion.div
                className="elegant-carousel-dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`elegant-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{ y: [0, -900], opacity: [0, 0.7, 0] }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
