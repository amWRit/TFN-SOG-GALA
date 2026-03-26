import React from 'react';
import Link from 'next/link';
import styles from '../../styles/AboutPage.module.css';

const AboutCTA: React.FC = () => (
  <div style={{
    textAlign: 'center',
    marginTop: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
  }}>
    <Link href="/" className={styles['btn-gold']}>
      Back to Home
    </Link>
    <Link href="/samples/conceptnotes/ConceptNote.pdf" target="_blank" className={styles['btn-ghost-dark']}>
      Full Concept Note (PDF)
    </Link>
  </div>
);

export default AboutCTA;
