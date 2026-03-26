"use client";

import React, { useState, useEffect } from 'react';

import AboutHeader from './AboutHeader';
import AboutTabs from './AboutTabs';
import AboutTabContent from './AboutTabContent';
import AboutCTA from './AboutCTA';
import HighlightsSection from './HighlightsSection';
import BackgroundSection from './BackgroundSection';
import ObjectivesSection from './ObjectivesSection';
import WhySection from './WhySection';
import styles from '../../styles/AboutPage.module.css';

const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('background');

  // Persist active tab in localStorage
  useEffect(() => {
    const savedTab = typeof window !== 'undefined' && window.localStorage.getItem('aboutActiveTab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('aboutActiveTab', activeTab);
    }
  }, [activeTab]);

  const tabs = [
    {
      id: 'background',
      label: 'Background',
      content: `Nepal is about to welcome a new year. Across the country, every Baisakh, new academic year begins. Nearly 75% of Nepal's children attend public schools, with hopes that education will be able to pull them out of the vicious cycle of poverty, grant them a life of dignity, and allow them freedom and choices. The parents of these children stretch their resources and make the sacrifices needed to ensure their child can get an education and have a life better than their own — a life different from the one they were born into.

Yet for many children, the odds remain stacked against them. Across the country, public schools continue to face deep systemic challenges:

- Severe teacher shortages
- Limited teacher preparation and professional development  
- Overcrowded classrooms with limited learning resources
- Weak systems of support and accountability
- Persistent gender and socioeconomic barriers

Recent national assessments reveal a deep learning crisis beginning in the early grades. By Grade 3, students score on average only 43.5 percent in reading and 37.2 percent in numeracy, and more than 90 percent fail to meet minimum fluency benchmarks.

By Grade 5, 78 percent of students fail to meet minimum competency in mathematics, while many struggle to reach expected standards in Nepali, science, and English.

These early learning gaps widen as students progress through school. By Grade 10, national assessments show that 60 percent of students fail mathematics, 53.8 percent fail Nepali, and 50.2 percent fail science.

These numbers tell an uncomfortable truth: while Nepal has succeeded in bringing children into school, too many students are leaving without the foundational skills needed to shape their futures.

But this truth is only part of the story. Across classrooms throughout the country, teachers and school leaders are working every day to change what is possible for their students.

This April 10th, Teach For Nepal invites supporter and believers in public education to come together to recognize both the truth and the hope that define our education system today — and to invest in the individuals who are transforming Nepal's classrooms one life at a time.[file:1]`,
    },
    {
      id: 'why',
      label: 'Why Attend',
      content: `Teach For Nepal invites you to the Truth and Hope Gala 2026, an evening dedicated to confronting the realities of Nepal's education system while celebrating the individuals who are transforming it.

Every year, millions of children across Nepal enter classrooms with dreams for their future. Yet for many students in public schools, those dreams are challenged by overcrowded classrooms, limited resources, and systemic barriers that make completing their education difficult. Today, only 40% of students reach the Secondary Education Examination (SEE) and just 26% pass.

Despite these challenges, hope is emerging in classrooms across the country. Through its Fellowship program, Teach For Nepal recruits and develops talented young leaders who commit two years to teaching in underserved public schools. Fellows work closely with students, families, and communities to strengthen learning environments and inspire students to believe in their potential. Over the past 14 years, Teach For Nepal has been supporting over 8000 students annually and has built a growing movement of leaders committed to improving Nepal's education system.

The Truth and Hope Gala, taking place on April 10, 2026, will bring together leaders from business, philanthropy, government, and civil society to celebrate the teachers, students, and changemakers driving this transformation. The evening will feature inspiring student stories, voices from Teach For Nepal Fellows and alumni, and our champions. There will be a special address by Rouble Nagi, recipient of the Global Teacher Prize, whose work has transformed the lives of thousands of children through education and art in India. A highlight of the evening will be a live charity auction, where unique items, experiences, and contributions from generous individuals and organizations will be auctioned to raise funds for strengthening public schools.

We hope for your attendance and participation at the Truth and Hope Gala. Your participation will help transform a moment of generosity into meaningful support for students, teachers, and classrooms across Nepal.

Together, we can confront the truth of the challenges facing public education — and invest in the hope that is transforming classrooms across Nepal.[file:1]`,
    },
    {
      id: 'objectives',
      label: 'Objectives',
      content: `The Truth and Hope Gala brings together leaders from business, philanthropy, government, and civil society to collectively invest in the future of Nepal's children. The event highlights both the realities facing Nepal's public education system and the transformative impact of inspiring teachers and leaders working in underserved public schools. Through this gathering, Teach For Nepal seeks to mobilize resources, strengthen partnerships, and expand opportunities for students across the country.

**Key Objectives**

- **Mobilize Resources for Education**: Raise financial support to strengthen Teach For Nepal's Fellowship program and support teachers working in underserved public schools.
- **Engage Corporate Leaders as Partners in Nation Building**: Build long-term partnerships with companies committed to strengthening public schools and expanding educational opportunity.
- **Highlight the Truth and the Hope in Nepal's Education System**: Share powerful stories and evidence from classrooms that illuminate both the challenges students face and the hope created by committed teachers and leaders.
- **Celebrate Education Changemakers**: Recognize Fellows, students, alumni, educators, and partners who are transforming learning and leadership in public schools.
- **Expand the Movement for Education Equity**: Inspire a wider community of supporters who believe in strengthening public schools as a pathway to national development.[file:1]`,
    },
    {
      id: 'highlights',
      label: 'Highlights',
      content: `**Speakers: Stories of Truth and Hope**

The heart of the evening will be the stories of Teach For Nepal Fellows and alumni students. These are stories of classrooms where the odds were high and the resources were few, and of what became possible when a teacher chose to believe in a child's potential. Their words will bring to life both the truth of the challenges facing Nepal's public schools and the hope that is growing within them.

**Performances**

Throughout the evening, guests will be treated to artistic performances and that celebrate the talent, creativity, and aspirations of young people across Nepal. These performances are a reminder of what is possible when children are given space to express themselves and dream.

**Live Charity Auction**

A highlight of the evening will be a live charity auction, where unique items and experiences generously contributed by supporters will be auctioned to raise funds for strengthening public schools. From travel experiences and dining to artworks, cultural experiences, and premium products — each item bid upon becomes a direct investment in Nepal's next generation. You can immediately purchase through QR or credit card.

**Dinner**

The evening will conclude with a shared dinner, offering guests the opportunity to connect with leaders across sectors, deepen partnerships, and celebrate the growing movement to strengthen Nepal's public schools. It is a moment to reflect on the truth we have heard — and to carry forward the hope we choose to invest in.[file:1]`,
    },
  ];

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      background: '#ffffff',
      overflow: 'hidden',
      padding: '40px 24px 60px'
    }}>
      {/* <GoldSpatter /> */}
      <AboutHeader />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto' }}>
        <AboutTabs
          tabs={tabs.map(({ id, label }) => ({ id, label }))}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {activeTab === 'background' && <BackgroundSection />}
        {activeTab === 'why' && <WhySection />}
        {activeTab === 'objectives' && <ObjectivesSection />}
        {activeTab === 'highlights' && <HighlightsSection />}
        {!(activeTab === 'background' || activeTab === 'why' || activeTab === 'objectives' || activeTab === 'highlights') && (
          <AboutTabContent content={tabs.find(t => t.id === activeTab)?.content || ''} />
        )}
        <AboutCTA />
      </div>
    </section>
  );
};

export default AboutPage;
