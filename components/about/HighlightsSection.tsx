import React from 'react';
import styles from '../../styles/AboutPage.module.css';

const highlights = [
  {
    img: '/samples/highlights/icons/speaker.png',
    title: 'Speakers: Stories of Truth and Hope',
    text: `The heart of the evening will be the stories of Teach For Nepal Fellows and alumni students. These are stories of classrooms where the odds were high and the resources were few, and of what became possible when a teacher chose to believe in a child's potential. Their words will bring to life both the truth of the challenges facing Nepal's public schools and the hope that is growing within them.`,
  },
  {
    img: '/samples/highlights/icons/performance.png',
    title: 'Performances',
    text: `Throughout the evening, guests will be treated to artistic performances that celebrate the talent, creativity, and aspirations of young people across Nepal. These performances are a reminder of what is possible when children are given space to express themselves and dream.`,
  },
  {
    img: '/samples/highlights/icons/auction.png',
    title: 'Live Charity Auction',
    text: `A highlight of the evening will be a live charity auction, where unique items and experiences generously contributed by supporters will be auctioned to raise funds for strengthening public schools. From travel experiences and dining to artworks, cultural experiences, and premium products — each item bid upon becomes a direct investment in Nepal's next generation. You can immediately purchase through QR or credit card.`,
  },
  {
    img: '/samples/highlights/icons/dinner.png',
    title: 'Dinner',
    text: `The evening will conclude with a shared dinner, offering guests the opportunity to connect with leaders across sectors, deepen partnerships, and celebrate the growing movement to strengthen Nepal's public schools. It is a moment to reflect on the truth we have heard — and to carry forward the hope we choose to invest in.`,
  },
];

const HighlightsSection: React.FC = () => (
  <div
    className={styles['tab-content']}
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '2rem',
      justifyContent: 'center',
      background: '#fff',
      maxWidth: 900,
      margin: '0 auto',
    }}
  >
    {highlights.map((h, i) => (
      <div
        key={i}
        style={{
          background: '#f7f9fc',
          border: '1px solid #e0e6f0',
          borderRadius: 18,
          padding: '2rem 1.5rem',
          boxShadow: '0 4px 24px #22589811',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1rem',
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={h.img}
            alt={h.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 18,
              boxShadow: '0 2px 12px #22589822',
            }}
          />
        </div>
        <h3
          style={{
            color: '#225898',
            fontWeight: 700,
            fontSize: '1.2rem',
            margin: 0,
          }}
        >
          {h.title}
        </h3>
        <p
          style={{
            color: '#1a2340',
            fontSize: '1rem',
            margin: 0,
          }}
        >
          {h.text}
        </p>
      </div>
    ))}
  </div>
);

export default HighlightsSection;
