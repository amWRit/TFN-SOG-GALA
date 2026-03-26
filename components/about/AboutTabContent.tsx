import React from 'react';
import styles from '../../styles/AboutPage.module.css';

interface AboutTabContentProps {
  content: string;
}

const AboutTabContent: React.FC<AboutTabContentProps> = ({ content }) => (
  <div className={styles['tab-content']}>
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

export default AboutTabContent;
