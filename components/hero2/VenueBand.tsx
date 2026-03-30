import React from 'react';
import styles from './hero.module.css';

const VenueBand: React.FC = () => (
  <div className={`${styles.venueBand} ${styles.slideUp}`}>
    <span style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '1px',
      height: '26px',
      background: 'rgba(255,255,255,0.4)',
      zIndex: 2
    }} />
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: 'white', whiteSpace: 'nowrap', flex: 1, textAlign: 'right', paddingRight: 24 }}>
        Hotel Yak &amp; Yeti
      </span>
      <span style={{ flex: 0, width: 48 }} />
      <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: 'white', whiteSpace: 'nowrap', flex: 1, textAlign: 'left', paddingLeft: 24 }}>
        10 April, 2026
      </span>
    </div>
  </div>
);

export default VenueBand;
