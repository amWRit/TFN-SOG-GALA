import React from 'react';

import styles from './hero.module.css';

interface HeroLogoProps {
  logoRef?: React.RefObject<HTMLImageElement | null>;
  style?: React.CSSProperties;
}

const HeroLogo: React.FC<HeroLogoProps> = ({ logoRef, style }) => (
  <img
    ref={logoRef}
    src="/images/logos/tfn_logo_white.png"
    alt="Teach For Nepal"
    className={styles.heroLogo}
    style={style}
  />
);

export default HeroLogo;
