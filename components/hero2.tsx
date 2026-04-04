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
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Triple-tap on logo for mobile
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;
    const handleTouchEnd = () => {
      tapCountRef.current += 1;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (tapCountRef.current >= 3) {
        setShowAdmin(true);
        tapCountRef.current = 0;
        return;
      }
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 600);
    };
    logo.addEventListener('touchend', handleTouchEnd);
    return () => {
      logo.removeEventListener('touchend', handleTouchEnd);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroTopContainer}>
        <HeroTop showAdmin={showAdmin} setShowAdmin={setShowAdmin} logoRef={logoRef} />
      </div>
      <HeroImageSection onShowVideo={() => setShowVideo(true)} />
      <VenueBand />
      <HeroTabBar onShowVideo={() => setShowVideo(true)} />
      <VideoModal show={showVideo} onClose={() => setShowVideo(false)} />
    </section>
  );
};

export default Hero2;