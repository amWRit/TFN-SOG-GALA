import React from 'react';


const topDots = [
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
];

const bottomDots = [
  { top: '72%', left: '10%', size: 16, opacity: 0.38 },
  { top: '80%', left: '22%', size: 12, opacity: 0.32 },
  { top: '88%', left: '35%', size: 20, opacity: 0.42 },
  { top: '75%', left: '60%', size: 14, opacity: 0.36 },
  { top: '92%', left: '80%', size: 18, opacity: 0.33 },
  { top: '85%', left: '50%', size: 10, opacity: 0.28 },
  { top: '95%', left: '15%', size: 8,  opacity: 0.22 },
  { top: '78%', left: '72%', size: 13, opacity: 0.29 },
  { top: '97%', left: '92%', size: 11, opacity: 0.25 },
  { top: '82%', left: '44%', size: 9,  opacity: 0.21 },
];

const GoldSpatter = () => (
  <div aria-hidden className="fadeUp5" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
    {[...topDots, ...bottomDots].map((dot, i) => (
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

export default GoldSpatter;
