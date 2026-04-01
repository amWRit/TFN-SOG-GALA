import React from 'react';
import styles from './hero.module.css';

interface HeroImageSectionProps {
  onShowVideo: () => void;
}


import { useEffect, useRef, useState } from 'react';

const HeroImageSection: React.FC<HeroImageSectionProps> = ({ onShowVideo }) => {
  const [showText, setShowText] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
        setShowText(true);
      } else {
        setShowText(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.heroImageSection} ref={sectionRef}>
      <img
        src="/images/home_bottom_image_short.png"
        alt="Children studying at school in Nepal"
        className={`${styles.bottomImage} ${styles.fadeUp3}`}
      />
      <div
        className={styles.imageOverlay}
        aria-hidden
      />
      <div
        className={styles.heroImageText}
        style={{
          opacity: showText ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(.4,0,.2,1) 0.5s',
        }}
      >
        A New Year. A Moment of Truth. A Reason for Hope.
      </div>
    </div>
  );
};

export default HeroImageSection;
