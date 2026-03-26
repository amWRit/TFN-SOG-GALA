import React from 'react';
import styles from './hero.module.css';

interface HeroImageSectionProps {
  onShowVideo: () => void;
}

const HeroImageSection: React.FC<HeroImageSectionProps> = ({ onShowVideo }) => (
  <div className={styles.heroImageSection}>
    <div className={styles.heroTabBar}>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLScnVe7ycPfu3luLRgyRz2MST5ii69LnWm6LM3MsbyLp-wdKZw/viewform" target="_blank" rel="noopener noreferrer"
        style={{ flex: 1, textAlign: 'center', padding: '14px 0', color: 'rgba(255,255,255,0.92)', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.98rem', letterSpacing: '0.04em', textTransform: 'uppercase', border: 'none', background: '#084691', outline: 'none', cursor: 'pointer', textDecoration: 'none', transition: 'background 0.18s, color 0.18s', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        onMouseOver={e => (e.currentTarget.style.background = '#06376e')}
        onMouseOut={e => (e.currentTarget.style.background = '#084691')}
      >Book Tickets</a>
      <a href="/about"
        style={{ flex: 1, textAlign: 'center', padding: '14px 0', color: 'rgba(255,255,255,0.92)', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.98rem', letterSpacing: '0.04em', textTransform: 'uppercase', border: 'none', background: '#084691', outline: 'none', cursor: 'pointer', textDecoration: 'none', transition: 'background 0.18s, color 0.18s', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        onMouseOver={e => (e.currentTarget.style.background = '#06376e')}
        onMouseOut={e => (e.currentTarget.style.background = '#084691')}
      >About the Gala</a>
      <a href="/program"
        style={{ flex: 1, textAlign: 'center', padding: '14px 0', color: 'rgba(255,255,255,0.92)', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.98rem', letterSpacing: '0.04em', textTransform: 'uppercase', border: 'none', background: '#084691', outline: 'none', cursor: 'pointer', textDecoration: 'none', transition: 'background 0.18s, color 0.18s', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        onMouseOver={e => (e.currentTarget.style.background = '#06376e')}
        onMouseOut={e => (e.currentTarget.style.background = '#084691')}
      >Program Details</a>
      <button onClick={onShowVideo}
        style={{ flex: 1, textAlign: 'center', padding: '14px 0', color: 'rgba(255,255,255,0.92)', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.98rem', letterSpacing: '0.04em', textTransform: 'uppercase', border: 'none', background: '#084691', outline: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', transition: 'background 0.18s, color 0.18s' }}
        onMouseOver={e => (e.currentTarget.style.background = '#06376e')}
        onMouseOut={e => (e.currentTarget.style.background = '#084691')}
      >Watch 2025 Highlights</button>
    </div>
    <img src="/images/home_bottom_image_short.png" alt="Children studying at school in Nepal" className={styles.heroMainImage} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.65) 100%)' }} />
  </div>
);

export default HeroImageSection;
