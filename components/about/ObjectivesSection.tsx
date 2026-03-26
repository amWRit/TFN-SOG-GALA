import React from 'react';
import styles from '../../styles/AboutPage.module.css';
import { SectionHeading, SectionSubheading } from './SectionHeadings';

const objectives = [
  'Mobilize Resources for Education: Raise financial support to strengthen Teach For Nepal\'s Fellowship program and support teachers working in underserved public schools.',
  'Engage Corporate Leaders as Partners in Nation Building: Build long-term partnerships with companies committed to strengthening public schools and expanding educational opportunity.',
  'Highlight the Truth and the Hope in Nepal\'s Education System: Share powerful stories and evidence from classrooms that illuminate both the challenges students face and the hope created by committed teachers and leaders.',
  'Celebrate Education Changemakers: Recognize Fellows, students, alumni, educators, and partners who are transforming learning and leadership in public schools.',
  'Expand the Movement for Education Equity: Inspire a wider community of supporters who believe in strengthening public schools as a pathway to national development.'
];

const objectivesImage = '/samples/conceptnotes/images/2.jpg'; // Change to any relevant image

const ObjectivesSection: React.FC = () => (
  <div className={styles['tab-content']}>
    <SectionHeading>Objectives of the Truth and Hope Gala</SectionHeading>
    <p style={{ color: '#1a2340', fontSize: '1.08rem', margin: '0 0 2rem 0' }}>
      The Truth and Hope Gala brings together leaders from business, philanthropy, government, and civil society to collectively invest in the future of Nepal’s children. The event highlights both the realities facing Nepal’s public education system and the transformative impact of inspiring teachers and leaders working in underserved public schools. Through this gathering, Teach For Nepal seeks to mobilize resources, strengthen partnerships, and expand opportunities for students across the country.
    </p>
    <div style={{ width: '100%', textAlign: 'center', margin: '2.5rem 0 0 0' }}>
      <img src={objectivesImage} alt="Objectives Visual" style={{ maxWidth: 640, width: '100%', borderRadius: 16, boxShadow: '0 4px 24px #22589822', margin: '0 auto' }} />
    </div>
    <SectionSubheading>Key Objectives</SectionSubheading>
    <ul style={{ color: '#1a2340', fontSize: '1.08rem', paddingLeft: 0, margin: '1.5rem 0 0 0', listStyle: 'none' }}>
      {objectives.map((obj, i) => (
        <li key={i} style={{ marginBottom: 18, lineHeight: 1.7, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ display: 'inline-block', marginTop: 4, minWidth: 18 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" fill="#d71a21" />
              <circle cx="8" cy="8" r="3" fill="#fff" />
            </svg>
          </span>
          <span>{obj}</span>
        </li>
      ))}
    </ul>

  </div>
);

export default ObjectivesSection;
