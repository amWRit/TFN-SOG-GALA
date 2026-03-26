"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

// ── Gold bokeh / spatter dots (pure CSS, no canvas) ───────────────────────
const GoldSpatter = () => (
  <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
    {[
      { top: '6%',  left: '12%', size: 18, opacity: 0.55 },
      { top: '3%',  left: '28%', size: 10, opacity: 0.4  },
      { top: '14%', left: '55%', size: 22, opacity: 0.5  },
      { top: '8%',  left: '70%', size: 14, opacity: 0.45 },
      { top: '20%', left: '82%', size: 8,  opacity: 0.35 },
      { top: '18%', left: '6%',  size: 12, opacity: 0.4  },
      { top: '30%', left: '90%', size: 16, opacity: 0.3  },
      { top: '2%',  left: '44%', size: 6,  opacity: 0.3  },
      { top: '25%', left: '38%', size: 9,  opacity: 0.25 },
      { top: '10%', left: '92%', size: 11, opacity: 0.4  },
    ].map((dot, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: dot.top,
          left: dot.left,
          width: dot.size,
          height: dot.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, #FFD700 0%, #B8860B 60%, transparent 100%)`,
          opacity: dot.opacity,
          filter: 'blur(1px)',
        }}
      />
    ))}
  </div>
);

const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('background');

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
    <>
      {/* Google Fonts + Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap');

        .hero-gold-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          background: linear-gradient(135deg, #FFE066 0%, #FFD700 30%, #C8A400 55%, #FFD700 75%, #FFF3A0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.05;
          letter-spacing: -0.01em;
          filter: drop-shadow(0 2px 12px rgba(212,175,55,0.35));
        }

        .hero-script {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 400;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.01em;
        }

        .hero-body {
          font-family: 'Montserrat', sans-serif;
        }

        .btn-gold {
          background: linear-gradient(135deg, #FFD700 0%, #C8A400 100%);
          color: #1a1a1a;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 16px 40px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(212,175,55,0.4);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(212,175,55,0.6);
          background: linear-gradient(135deg, #FFE066 0%, #FFD700 100%);
        }

        .btn-ghost-dark {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 15px 32px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(12px);
        }
        .btn-ghost-dark:hover {
          background: rgba(255,255,255,0.15);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .tab-bar {
          border-bottom: 1px solid rgba(255,255,255,0.12);
          margin-bottom: 48px;
          padding-bottom: 2px;
        }

        .tab-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 2px;
        }

        .tab-item {
          position: relative;
          padding: 16px 28px;
          color: rgba(255,255,255,0.6);
          font-family: 'Montserrat', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          backdrop-filter: blur(12px);
          border-radius: 8px 8px 0 0;
        }
        .tab-item:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.04);
        }
        .tab-item.active {
          color: #FFD700;
          background: rgba(255,215,0,0.08);
        }
        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FFD700, #FFD700, transparent);
          border-radius: 2px 2px 0 0;
        }

        .divider-gold {
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FFD700, transparent);
          margin: 24px auto;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.8s ease both; }
        .fade-up-2 { animation: fadeUp 0.8s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.8s 0.4s ease both; }

        @media (max-width: 768px) {
          .tab-item {
            padding: 14px 20px;
            font-size: 0.9rem;
            flex: 1 1 45%;
            margin: 2px;
          }
          .tab-container {
            justify-content: center;
            gap: 4px;
          }
        }

        @media (max-width: 480px) {
          .tab-item {
            flex: 1 1 100%;
            margin: 1px 0;
          }
        }
      `}</style>

      <section style={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '100vh', 
        background: '#0a0a0a', 
        overflow: 'hidden',
        padding: '40px 24px 60px'
      }}>
        <GoldSpatter />

        {/* Header */}
        <div className="fade-up-1" style={{ 
          textAlign: 'center', 
          marginBottom: '60px',
          position: 'relative', 
          zIndex: 2 
        }}>
          <img 
            src="/images/logos/tfn_logo_white.png" 
            alt="Teach For Nepal" 
            style={{ height: '72px', margin: '0 auto 20px', display: 'block' }} 
          />
          <p className="hero-script" style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
            marginBottom: '12px' 
          }}>
            About the Gala
          </p>
          <h1 className="hero-gold-title" style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 4.8rem)', 
            marginBottom: '16px' 
          }}>
            Truth & Hope
          </h1>
          <div className="divider-gold" />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto' }}>
          {/* Centered Horizontal Tab Bar - Wraps on Mobile */}
          <div className="fade-up-2 tab-bar">
            <div className="tab-container">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="fade-up-3" style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.92)',
              whiteSpace: 'pre-line'
            }}>
              <div dangerouslySetInnerHTML={{ __html: tabs.find(t => t.id === activeTab)?.content || '' }} />
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{
            textAlign: 'center',
            marginTop: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <Link href="/" className="btn-gold">
              Back to Home
            </Link>
            <Link href="/samples/conceptnotes/ConceptNote.pdf" target="_blank" className="btn-ghost-dark">
              Full Concept Note (PDF)
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
