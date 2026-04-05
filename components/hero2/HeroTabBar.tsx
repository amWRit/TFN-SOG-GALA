

import styles from './hero.module.css';
import { Ticket, Info, ClipboardList, Play, Gavel, CalendarCheck, List } from 'lucide-react';

interface HeroTabBarProps {
  onShowVideo: () => void;
}


const HeroTabBar: React.FC<HeroTabBarProps> = ({ onShowVideo }) => (
  <div className={`${styles.heroTabBar} ${styles.slideUp}`}>
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLScnVe7ycPfu3luLRgyRz2MST5ii69LnWm6LM3MsbyLp-wdKZw/viewform"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.tabButton}
    >
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Ticket size={26} style={{ marginBottom: 2 }} />
        <span className={styles.tabLabelLong}>Book Tickets</span>
        <span className={styles.tabLabelShort}>Tickets</span>
      </span>
    </a>
    <a
      href="/program"
      className={styles.tabButton}
    >
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <List size={26} style={{ marginBottom: 2 }} />
        <span className={styles.tabLabelLong}>Program Details</span>
        <span className={styles.tabLabelShort}>Program</span>
      </span>
    </a>
    {/* <button
      onClick={onShowVideo}
      className={styles.tabButton}
      type="button"
    >
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Play size={26} style={{ marginBottom: 2 }} />
        <span className={styles.tabLabelLong}>Watch 2025 Highlights</span>
        <span className={styles.tabLabelShort}>2025</span>
      </span>
    </button> */}
    <a
      href="/auction"
      className={styles.tabButton}
    >
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Gavel size={26} style={{ marginBottom: 2 }} />
        <span className={styles.tabLabelLong}>Auction Details</span>
        <span className={styles.tabLabelShort}>Auction</span>
      </span>
    </a>
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSeaP-ZaY6M41ktMYuf3-mpzATJIyfwq5pqw1S2LfNxpyGJgow/viewform"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.tabButton}
    >
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <CalendarCheck size={26} style={{ marginBottom: 2 }} />
        <span className={styles.tabLabelLong}>RSVP</span>
        <span className={styles.tabLabelShort}>RSVP</span>
      </span>
    </a>
    <a
      href="/about"
      className={styles.tabButton}
    >
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Info size={26} style={{ marginBottom: 2 }} />
        <span className={styles.tabLabelLong}>About the Gala</span>
        <span className={styles.tabLabelShort}>About</span>
      </span>
    </a>
  </div>
);

export default HeroTabBar;
