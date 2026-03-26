import React from 'react';
import styles from '../../styles/AboutPage.module.css';

interface AboutTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const AboutTabs: React.FC<AboutTabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className={`${styles['fade-up-2']} ${styles['tab-bar']}`}>
    <div className={styles['tab-container']}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${styles['tab-item']} ${activeTab === tab.id ? styles['active'] : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export default AboutTabs;
