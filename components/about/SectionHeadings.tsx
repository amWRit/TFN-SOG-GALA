import React from 'react';
import styles from '../../styles/AboutPage.module.css';

interface SectionHeadingProps {
  children: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ children }) => (
  <h2 style={{ color: '#d71a21', fontWeight: 800, fontSize: '2rem', margin: '1.5rem 0 1rem' }}>
    {children}
  </h2>
);

export const SectionSubheading: React.FC<SectionHeadingProps> = ({ children }) => (
  <h3 style={{ color: '#225898', fontWeight: 700, fontSize: '1.2rem', margin: '1rem 0 0.5rem' }}>
    {children}
  </h3>
);
