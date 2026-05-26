import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturedProperties from '../components/FeaturedProperties';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <HeroSection />
      <AboutSection />
      <FeaturedProperties />
    </div>
  );
};

export default Home;