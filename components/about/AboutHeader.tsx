import React from 'react';
import styles from '../../styles/AboutPage.module.css';

const AboutHeader: React.FC = () => (
  <div className={styles['fade-up-1']} style={{ 
    textAlign: 'center', 
    marginBottom: '60px',
    position: 'relative', 
    zIndex: 2 
  }}>
    <img
      src="/images/logos/tfnlogo.png"
      alt="Teach For Nepal"
      style={{ height: '72px', margin: '0 auto 20px', display: 'block' }}
    />
    <p className={styles['hero-script']} style={{ 
      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
      marginBottom: '12px' 
    }}>
      About the Gala
    </p>
    <h1 className={styles['hero-gold-title']} style={{ 
      fontSize: 'clamp(2.2rem, 5vw, 4.8rem)', 
      marginBottom: '16px' 
    }}>
      Truth & Hope
    </h1>
    <div className={styles['divider-gold']} />
  </div>
);

export default AboutHeader;
