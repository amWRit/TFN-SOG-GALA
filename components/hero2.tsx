"use client";
import React, { useState, useEffect, useRef } from 'react';
import HeroTop from './hero2/HeroTop';
import VenueBand from './hero2/VenueBand';
import HeroImageSection from './hero2/HeroImageSection';
import HeroTabBar from './hero2/HeroTabBar';
import VideoModal from './hero2/VideoModal';
import styles from './hero2/hero.module.css';

const Hero2 = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const logoRef = useRef<HTMLImageElement | null>(null);
  let longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Secret key sequence for desktop
  useEffect(() => {
    let buffer = '';
    const handler = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.endsWith('admin')) {
        setShowAdmin(true);
        buffer = '';
      }
      if (buffer.length > 10) buffer = buffer.slice(-10);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Long-press for mobile (on logo)
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;
    const handleTouchStart = () => {
      longPressTimer.current = setTimeout(() => setShowAdmin(true), 1200);
    };
    const handleTouchEnd = () => {
      if (longPressTimer.current !== null) {
        clearTimeout(longPressTimer.current);
      }
    };
    logo.addEventListener('touchstart', handleTouchStart);
    logo.addEventListener('touchend', handleTouchEnd);
    return () => {
      logo.removeEventListener('touchstart', handleTouchStart);
      logo.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      <div style={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <HeroTop showAdmin={showAdmin} setShowAdmin={setShowAdmin} logoRef={logoRef} />
        <VenueBand />
        <HeroTabBar onShowVideo={() => setShowVideo(true)} />
      </div>
      <div style={{ width: '100%' }}>
        <HeroImageSection onShowVideo={() => setShowVideo(true)} />
      </div>
      <VideoModal show={showVideo} onClose={() => setShowVideo(false)} />
    </section>
  );
};

export default Hero2;