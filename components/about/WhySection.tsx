import React from 'react';
import styles from '../../styles/AboutPage.module.css';
import { SectionHeading, SectionSubheading } from './SectionHeadings';

const whySections = [
  {
    heading: 'A New Year, New Hopes',
    text: `Nepal is about to welcome a new year. Across the country, every Baisakh, new academic year begins. Nearly 75% of Nepal's children attend public schools, with hopes that education will be able to pull them out of the vicious cycle of poverty, grant them a life of dignity, and allow them freedom and choices. The parents of these children stretch their resources and make the sacrifices needed to ensure their child can get an education and have a life better than their own — a life different from the one they were born into.`
  },
  {
    heading: 'Systemic Challenges',
    text: `For many children, the odds remain stacked against them. Across the country, public schools continue to face deep systemic challenges: \n\n- Severe teacher shortages\n- Limited teacher preparation and professional development\n- Overcrowded classrooms with limited learning resources\n- Weak systems of support and accountability\n- Persistent gender and socioeconomic barriers`
  },
  {
    heading: 'A Learning Crisis',
    text: `Recent national assessments reveal a deep learning crisis beginning in the early grades. By Grade 3, students score on average only 43.5 percent in reading and 37.2 percent in numeracy, and more than 90 percent fail to meet minimum fluency benchmarks.\n\nBy Grade 5, 78 percent of students fail to meet minimum competency in mathematics, while many struggle to reach expected standards in Nepali, science, and English.\n\nThese early learning gaps widen as students progress through school. By Grade 10, national assessments show that 60 percent of students fail mathematics, 53.8 percent fail Nepali, and 50.2 percent fail science.`
  },
  {
    heading: 'Truth and Hope',
    text: `These numbers tell an uncomfortable truth: while Nepal has succeeded in bringing children into school, too many students are leaving without the foundational skills needed to shape their futures.\n\nBut this truth is only part of the story. Across classrooms throughout the country, teachers and school leaders are working every day to change what is possible for their students.\n\nThis April 10th, Teach For Nepal invites supporter and believers in public education to come together to recognize both the truth and the hope that define our education system today — and to invest in the individuals who are transforming Nepal's classrooms one life at a time.`
  }
];

const WhySection: React.FC = () => (
  <div className={styles['tab-content']}>
    <div style={{ width: '100%', textAlign: 'center', marginBottom: '2.5rem' }}>
      <img src="/samples/conceptnotes/images/1.jpg" alt="Why Attend" style={{ maxWidth: 640, width: '100%', borderRadius: 16, boxShadow: '0 4px 24px #22589822', margin: '0 auto' }} />
    </div>
    {whySections.map((sec, i) => (
      <div key={i} style={{ marginBottom: '2.2rem' }}>
        <SectionHeading>{sec.heading}</SectionHeading>
        <p style={{ color: '#1a2340', fontSize: '1.08rem', margin: 0 }}>{sec.text}</p>
      </div>
    ))}
  </div>
);

export default WhySection;
