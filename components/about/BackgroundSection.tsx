import React from 'react';
import styles from '../../styles/AboutPage.module.css';
import { SectionHeading, SectionSubheading } from './SectionHeadings';

const backgroundSections = [
  {
    heading: '',
    text: `Teach For Nepal invites you to the Truth and Hope Gala 2026, an evening dedicated to confronting the realities of Nepal's education system while celebrating the individuals who are transforming it.`
  },
  {
    heading: 'The Truth',
    text: `Every year, millions of children across Nepal enter classrooms with dreams for their future. Yet for many students in public schools, those dreams are challenged by overcrowded classrooms, limited resources, and systemic barriers that make completing their education difficult. Today, only 40% of students reach the Secondary Education Examination (SEE) and just 26% pass.`
  },
  {
    heading: 'Hope in Action',
    text: `Despite these challenges, hope is emerging in classrooms across the country. 
    
        Through its Fellowship program, Teach For Nepal recruits and develops talented young leaders who commit two years to teaching in underserved public schools. Fellows work closely with students, families, and communities to strengthen learning environments and inspire students to believe in their potential. Over the past 14 years, Teach For Nepal has been supporting over 8000 students annually and has built a growing movement of leaders committed to improving Nepal's education system.`
  },
  {
    heading: 'A Night to Remember',
    text: `The Truth and Hope Gala, taking place on April 10, 2026, will bring together leaders from business, philanthropy, government, and civil society to celebrate the teachers, students, and changemakers driving this transformation. The evening will feature inspiring student stories, voices from Teach For Nepal Fellows and alumni, and our champions. There will be a special address by Rouble Nagi, recipient of the Global Teacher Prize, whose work has transformed the lives of thousands of children through education and art in India. A highlight of the evening will be a live charity auction, where unique items, experiences, and contributions from generous individuals and organizations will be auctioned to raise funds for strengthening public schools.`
  },
  {
    heading: 'Join Us',
    text: `We hope for your attendance and participation at the Truth and Hope Gala. Your participation will help transform a moment of generosity into meaningful support for students, teachers, and classrooms across Nepal. Together, we can confront the truth of the challenges facing public education — and invest in the hope that is transforming classrooms across Nepal.`
  }
];

const backgroundImage = '/samples/conceptnotes/images/4.jpg'; // You can change this to any relevant image

const BackgroundSection: React.FC = () => (
  <div className={styles['tab-content']}>

    {backgroundSections.map((sec, i) => (
      <div key={i} style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>{sec.heading}</SectionHeading>
        <p style={{ color: '#1a2340', fontSize: '1.08rem', margin: 0, whiteSpace: 'pre-line' }}>{sec.text}</p>
      </div>
    ))}
    <div style={{ width: '100%', textAlign: 'center', marginBottom: '2.5rem' }}>
      <img src={backgroundImage} alt="Why Attend" style={{ maxWidth: 640, width: '100%', borderRadius: 16, boxShadow: '0 4px 24px #22589822', margin: '0 auto' }} />
    </div>
  </div>
);

export default BackgroundSection;
