import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './AboutSection.css';

const AboutSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      title: "AI Price Prediction",
      description: "Our advanced machine learning model accurately predicts property values based on location, size, and market trends.",
      icon: "🤖",
      color: "var(--primary-green)",
      gradient: "linear-gradient(135deg, #2d5a27, #4a7c59)",
      details: ["Machine Learning", "95% Accuracy", "Real-time Analysis"]
    },
    {
      id: 2,
      title: "Premium Locations",
      description: "Curated selection of properties in the most desirable neighborhoods with excellent growth potential.",
      icon: "📍",
      color: "var(--accent-orange)",
      gradient: "linear-gradient(135deg, #ff6b35, #d4af37)",
      details: ["Prime Areas", "High ROI", "Growth Potential"]
    },
    {
      id: 3,
      title: "Expert Support", 
      description: "Professional real estate agents and support team to guide you through every step of your property journey.",
      icon: "👥",
      color: "var(--gold)",
      gradient: "linear-gradient(135deg, #d4af37, #ff6b35)",
      details: ["24/7 Support", "Expert Agents", "Personalized Service"]
    }
  ];

  const processes = [
    { step: "01", title: "Search", description: "Browse through our curated property listings", icon: "🔍" },
    { step: "02", title: "Analyze", description: "Get AI-powered price predictions and insights", icon: "📊" },
    { step: "03", title: "Connect", description: "Get connected with verified agents and sellers", icon: "🤝" },
    { step: "04", title: "Secure", description: "Complete your purchase with full legal support", icon: "🔒" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="about-section section-padding">
      <div className="container">
        <motion.div 
          className="about-header text-center mb-60"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="section-badge"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ✨ Why Choose Us
          </motion.div>
          <h2>Revolutionizing Real Estate with Technology</h2>
          <p>Leading the future of real estate with innovative AI-powered solutions and personalized service that puts you first</p>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.id}
              className="feature-card enhanced"
              variants={itemVariants}
              whileHover={{ 
                y: -15,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
              }}
              onHoverStart={() => setHoveredCard(feature.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.div 
                className="feature-icon-wrapper"
                style={{ background: feature.gradient }}
                animate={hoveredCard === feature.id ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="feature-icon-enhanced">{feature.icon}</div>
              </motion.div>
              
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                
                <motion.div 
                  className="feature-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={hoveredCard === feature.id ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.details.map((detail, idx) => (
                    <motion.span 
                      key={idx}
                      className="detail-tag"
                      initial={{ x: -20, opacity: 0 }}
                      animate={hoveredCard === feature.id ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      ✓ {detail}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
              
              <motion.div 
                className="feature-overlay"
                style={{ background: feature.gradient }}
                initial={{ opacity: 0 }}
                animate={hoveredCard === feature.id ? { opacity: 0.05 } : { opacity: 0 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Process Section */}
        <motion.div 
          className="process-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="process-header text-center mb-40">
            <h3>How It Works</h3>
            <p>Simple steps to find your perfect property</p>
          </div>
          
          <div className="process-grid">
            {processes.map((process, index) => (
              <motion.div 
                key={index}
                className="process-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="process-step">{process.step}</div>
                <div className="process-icon">{process.icon}</div>
                <h4>{process.title}</h4>
                <p>{process.description}</p>
                {index < processes.length - 1 && (
                  <motion.div 
                    className="process-arrow"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;