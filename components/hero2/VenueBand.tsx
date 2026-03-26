import React from 'react';
import styles from './hero.module.css';

const VenueBand: React.FC = () => (
  <div className={`${styles.venueBand} ${styles.fadeUp3}`}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: 'white', whiteSpace: 'nowrap' }}>
        Hotel Yak &amp; Yeti
      </span>
      <span style={{ width: '1px', height: '26px', background: 'rgba(255,255,255,0.4)', display: 'block' }} />
      <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: 'white', whiteSpace: 'nowrap' }}>
        10 April, 2026
      </span>
    </div>
  </div>
);

export default VenueBand;
