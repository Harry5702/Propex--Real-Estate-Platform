import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Footer from './components/Footer';

// Admin Panel
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHero from './pages/admin/AdminHero';
import AdminFeatured from './pages/admin/AdminFeatured';
import AdminListings from './pages/admin/AdminListings';

import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Admin Routes (no Navbar/Footer) ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="featured" element={<AdminFeatured />} />
          <Route path="listings" element={<AdminListings />} />
        </Route>

        {/* ── Public Routes ── */}
        <Route path="/*" element={
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
