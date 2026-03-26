import React from 'react';
import styles from './hero.module.css';

interface HeroAdminNavbarProps {
  showAdmin: boolean;
}

const HeroAdminNavbar: React.FC<HeroAdminNavbarProps> = ({ showAdmin }) => {
  if (!showAdmin) return null;
  return (
    <div style={{ marginTop: 0, marginBottom: 24, display: 'flex', gap: 16, justifyContent: 'center' }}>
      <a href="/admin/dashboard" className={styles.heroAdminButton}>Admin Dashboard</a>
      <a href="/auction" className={styles.heroAdminButton}>Auction</a>
      <a href="/seating" className={styles.heroAdminButton}>Seating</a>
      <a href="/register" className={styles.heroAdminButton}>Register</a>
    </div>
  );
};

export default HeroAdminNavbar;
