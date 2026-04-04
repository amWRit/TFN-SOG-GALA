
'use client';

import React from 'react';
import styles from './hero.module.css';
import { Shield, TrendingUp, Trophy, Armchair, Monitor, Tv } from 'lucide-react';

interface HeroAdminNavbarProps {
  showAdmin: boolean;
}

const navLinks = [
  { href: "/admin/dashboard", label: "Admin", Icon: Shield },
  { href: "/progress", label: "Progress", Icon: TrendingUp },
  { href: "/leaderboard", label: "Leaderboard", Icon: Trophy },
  { href: "/seating", label: "Seating", Icon: Armchair },
  { href: "/display1", label: "Auction/Progress", Icon: Monitor },
  { href: "/display2", label: "Progress/Leaderboard", Icon: Tv },
];

const HeroAdminNavbar: React.FC<HeroAdminNavbarProps> = ({ showAdmin }) => {
  if (!showAdmin) return null;
  return (
    <div
      style={{ marginTop: 0, marginBottom: 24, gap: 12, justifyItems: 'stretch' }}
      className={styles.heroAdminNavbar}
    >
      {navLinks.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          className={styles.heroAdminButton}
        >
          <span className={styles.heroAdminIcon} aria-hidden="true">
            <Icon size={22} />
          </span>
          <span className={styles.heroAdminLabelLong}>{label}</span>
        </a>
      ))}
    </div>
  );
};

export default HeroAdminNavbar;
