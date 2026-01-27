
import React from 'react';
import Navbar from '../components/navbar';
import Hero from '../components/hero';
import Stats from '../components/stats';
import Highlights from '../components/highlights';
import CTA from '../components/cta';
import styles from '../styles/homepage.module.css';


const TeachForNepalHomepage = () => {
  return (
    <div className={styles.heroContainer}>
      <Navbar />
      <Hero />
      <Stats />
      <Highlights />
      <CTA />
    </div>
  );
};

export default TeachForNepalHomepage;
