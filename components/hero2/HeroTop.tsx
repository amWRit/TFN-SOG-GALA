import React, { useRef, useEffect } from 'react';
import styles from './hero.module.css';
import GoldSpatter from './GoldSpatter';
import CountdownTimer from './CountdownTimer';
import HeroAdminNavbar from './HeroAdminNavbar';

interface HeroTopProps {
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  logoRef: React.RefObject<HTMLImageElement | null>;
}

const HeroTop: React.FC<HeroTopProps> = ({ showAdmin, setShowAdmin, logoRef }) => {
  const targetDate = "2026-04-10T18:00:00";

  return (
    <div className={`${styles.heroTop} ${styles.fadeUp3}`}>
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '100%',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(180,140,10,0.18) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <GoldSpatter />
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <HeroAdminNavbar showAdmin={showAdmin} />
        <div style={{ marginBottom: '16px' }}>
          <img ref={logoRef} src="/images/logos/tfn_logo_white.png" alt="Teach For Nepal" className={styles.heroLogo} />
        </div>
        <p className={styles.heroScript} style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', marginBottom: '4px' }}>
          Join us for
        </p>
        <h1 className={styles.heroGoldTitle} style={{ fontSize: 'clamp(2rem, 4.2vw, 4.2rem)', marginBottom: '8px' }}>
          TRUTH &amp; HOPE GALA 2026
        </h1>
        <div className={styles.dividerGold} style={{ marginBottom: '12px' }} />
        <p className={styles.heroBody} style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)', color: 'white', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Strengthening Public Schools in Nepal
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, margin: '0 auto 20px' }}>
          Because Nepal's public schools are more than institutions of learning. They are spaces where the future of the nation quietly takes shape each day.
        </p>
        <CountdownTimer targetDate={targetDate} />
      </div>
    </div>
  );
};

export default HeroTop;
