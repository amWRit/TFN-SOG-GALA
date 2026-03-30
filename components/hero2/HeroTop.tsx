import React, { useRef, useEffect, useState } from 'react';
import styles from './hero.module.css';
import GoldSpatter from './GoldSpatter';
import CountdownTimer from './CountdownTimer';
import HeroAdminNavbar from './HeroAdminNavbar';
import HeroLogo from './HeroLogo';

interface HeroTopProps {
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  logoRef: React.RefObject<HTMLImageElement | null>;
}

const HeroTop: React.FC<HeroTopProps> = ({ showAdmin, setShowAdmin, logoRef }) => {
  const targetDate = "2026-04-10T18:00:00";

  // Animation state for each chunk
  const [showChunk1, setShowChunk1] = useState(false);
  const [showChunk2, setShowChunk2] = useState(false);
  const [showChunk3, setShowChunk3] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowChunk1(true), 400);
    const t2 = setTimeout(() => setShowChunk2(true), 1200);
    const t3 = setTimeout(() => setShowChunk3(true), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

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
        <div style={{ margin: '0 0 10px 0' }}>
          <HeroLogo logoRef={logoRef} />
        </div>
        <p className={styles.heroScript} style={{ marginBottom: '4px' }}>
          Join us for
        </p>
        <h1 className={styles.heroGoldTitle} style={{ marginBottom: '8px' }}>
          TRUTH &amp; HOPE<br />
          <span style={{ fontSize: '0.8em', letterSpacing: '0.08em', display: 'block', marginTop: '2px' }}>GALA 2026</span>
        </h1>
        <div className={styles.dividerGold} style={{ marginBottom: '12px' }} />
        <p className={styles.heroBody} style={{ color: 'white', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Strengthening Public Schools in Nepal
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, margin: '0 auto 20px', fontSize: 'clamp(1.1rem, 2vw, 1.3rem)' }}>
          Because Nepal's public schools are more than institutions of learning.<br />
          They are spaces where the future of the nation quietly takes shape each day.
        </p>
        <CountdownTimer targetDate={targetDate} />
      </div>
      <div style={{ height: '18px' }} />
      <div className={styles.heroImageText} style={{ display: 'flex', justifyContent: 'center', gap: '1.2em' }}>
        <span
          style={{
            opacity: showChunk1 ? 1 : 0,
            transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1)',
          }}
        >
          One Night.
        </span>
        <span
          style={{
            opacity: showChunk2 ? 1 : 0,
            transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1)',
          }}
        >
          One Cause.
        </span>
        <span
          style={{
            opacity: showChunk3 ? 1 : 0,
            transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1)',
          }}
        >
          Countless Futures.
        </span>
      </div>
    </div>
  );
};

export default HeroTop;
