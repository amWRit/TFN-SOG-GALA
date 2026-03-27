
import styles from './hero.module.css';

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
      Book Tickets
    </a>
    <a
      href="/about"
      className={styles.tabButton}
    >
      About the Gala
    </a>
    <a
      href="/program"
      className={styles.tabButton}
    >
      Program Details
    </a>
    <button
      onClick={onShowVideo}
      className={styles.tabButton}
      type="button"
    >
      Watch 2025 Highlights
    </button>
  </div>
);

export default HeroTabBar;
