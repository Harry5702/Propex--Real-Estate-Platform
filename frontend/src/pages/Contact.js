import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    preferredContact: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        preferredContact: 'email'
      });
    }, 2000);
  };
  // Offices section removed as per requirement (Islamabad details shown in footer only)

  const quickActions = [
    {
      title: 'Schedule a Call',
      description: 'Book a free consultation with our experts',
      icon: 'fas fa-phone-alt',
      action: 'schedule-call'
    },
    {
      title: 'Property Valuation',
      description: 'Get instant property price estimate',
      icon: 'fas fa-calculator',
      action: 'valuation'
    }
  ];

  const faqItems = [
    {
      question: 'How do I list my property on Propex?',
      answer: 'Simply create an account, click on "List Property", fill in the details, upload photos, and our team will verify and list your property within 24 hours.'
    },
    {
      question: 'Is the property valuation accurate?',
      answer: 'Our AI-powered valuation system uses comprehensive market data and is 95% accurate. However, we recommend getting a professional appraisal for final decisions.'
    },
    {
      question: 'What areas do you cover in Pakistan?',
      answer: 'We currently cover major cities including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and are expanding to other cities soon.'
    },
    {
      question: 'Are there any hidden charges?',
      answer: 'No, we believe in complete transparency. All charges are clearly mentioned upfront with no hidden fees.'
    }
  ];

  return (
    <div className="contact-page">
      <div className="container">
        {/* Quick Actions */}
        <section className="quick-actions-section">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            How Can We Help You?
          </motion.h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                className="quick-action-card"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="action-icon">
                  <i className={action.icon}></i>
                </div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <button className="action-btn">Get Started</button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="contact-main-section">
          <div className="contact-content">
            <motion.div 
              className="contact-form-section"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours</p>
              </div>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <div className="input-group">
                      <i className="fas fa-user"></i>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name" 
                        className="form-input" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <div className="input-group">
                      <i className="fas fa-envelope"></i>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email" 
                        className="form-input" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <div className="input-group">
                      <i className="fas fa-phone"></i>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+92 300 1234567" 
                        className="form-input" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Service Needed *</label>
                    <div className="input-group">
                      <i className="fas fa-cog"></i>
                      <select 
                        className="form-input"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Service</option>
                        <option value="buy">Buy Property</option>
                        <option value="sell">Sell Property</option>
                        <option value="rent">Rent Property</option>
                        <option value="valuation">Property Valuation</option>
                        <option value="consultation">Real Estate Consultation</option>
                        <option value="investment">Investment Advisory</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Preferred Contact Method</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input 
                        type="radio" 
                        name="preferredContact" 
                        value="email"
                        checked={formData.preferredContact === 'email'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-checkmark"></span>
                      <i className="fas fa-envelope"></i>
                      Email
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio" 
                        name="preferredContact" 
                        value="phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-checkmark"></span>
                      <i className="fas fa-phone"></i>
                      Phone
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio" 
                        name="preferredContact" 
                        value="whatsapp"
                        checked={formData.preferredContact === 'whatsapp'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-checkmark"></span>
                      <i className="fab fa-whatsapp"></i>
                      WhatsApp
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Message *</label>
                  <div className="input-group">
                    <i className="fas fa-comment-alt"></i>
                    <textarea 
                      placeholder="Tell us about your requirements..." 
                      className="form-textarea" 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      required
                    ></textarea>
                  </div>
                </div>
                
                <motion.button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
            
            <motion.div 
              className="contact-info-section"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="info-header">
                <h2>Contact Information</h2>
                <p>Get in touch with us through any of these channels</p>
              </div>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="method-info">
                    <h3>Call Us</h3>
                    <p>+92 21 1111 2222</p>
                    <p>Available 24/7</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="method-info">
                    <h3>Email Us</h3>
                    <p>info@propex.com</p>
                    <p>We reply within 2 hours</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="method-info">
                    <h3>WhatsApp</h3>
                    <p>+92 300 1111 2222</p>
                    <p>Quick responses</p>
                  </div>
                </div>
              </div>
              
              <div className="business-hours">
                <h3>Business Hours</h3>
                <div className="hours-list">
                  <div className="hours-item">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span>Sunday</span>
                    <span>12:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Offices section removed as requested */}

        {/* FAQ Section */}
        <section className="faq-section">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="faq-grid">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="faq-question">
                  <i className="fas fa-question-circle"></i>
                  <h3>{faq.question}</h3>
                </div>
                <p className="faq-answer">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;