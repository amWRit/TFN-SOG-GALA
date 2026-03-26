"use client";
import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

// ── Inline CountdownTimer ──────────────────────────────────────────────────
interface CountdownTimerProps {
  targetDate: string | number | Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(212,175,55,0.35)',
          borderRadius: '10px',
          width: '72px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFD700', fontFamily: 'inherit', letterSpacing: '-0.02em' }}>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      <Unit value={timeLeft.days} label="Days" />
      <Unit value={timeLeft.hours} label="Hours" />
      <Unit value={timeLeft.minutes} label="Mins" />
      <Unit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

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

// ── Main Hero ──────────────────────────────────────────────────────────────
const Hero2 = () => {
  const [showVideo, setShowVideo] = useState(false);
  const targetDate = "2026-04-10T18:00:00";

  return (
    <>
      {/* Google Fonts */}
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

        .venue-band {
          background: #c8151c;
          background: linear-gradient(90deg, #a81018 0%, #d71a21 40%, #d71a21 60%, #a81018 100%);
        }

        .btn-register {
          background: #d71a21;
          color: white;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 14px 36px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(215,26,33,0.4);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-register:hover {
          background: #b81519;
          transform: scale(1.04);
          box-shadow: 0 8px 32px rgba(215,26,33,0.55);
        }

        .btn-ghost {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 13px 28px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.22);
          cursor: pointer;
          font-size: 0.82rem;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(6px);
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.15);
          color: white;
          transform: scale(1.03);
        }

        .divider-gold {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FFD700, transparent);
          margin: 0 auto;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.9s ease both; }
        .fade-up-2 { animation: fadeUp 0.9s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.9s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.9s 0.45s ease both; }
        .fade-up-5 { animation: fadeUp 0.9s 0.6s ease both; }
        .fade-up-6 { animation: fadeUp 0.9s 0.75s ease both; }
      `}</style>

      <section style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0a0a0a', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* ── Dark centered top section ─────────────────────────────── */}
        <div style={{ position: 'relative', flex: '1 1 50%', padding: '18px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div aria-hidden style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '800px', height: '100%',
            background: 'radial-gradient(ellipse at 50% 30%, rgba(180,140,10,0.18) 0%, transparent 65%)',
            pointerEvents: 'none', zIndex: 0
          }} />
          <GoldSpatter />

          <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            <div className="fade-up-1" style={{ marginBottom: '16px' }}>
              <img src="/images/logos/tfn_logo_white.png" alt="Teach For Nepal" style={{ height: '64px', margin: '0 auto', display: 'block' }} />
            </div>
            <p className="hero-script fade-up-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', marginBottom: '4px' }}>
              Join us for
            </p>
            <h1 className="hero-gold-title fade-up-3" style={{ fontSize: 'clamp(2rem, 4.2vw, 4.2rem)', marginBottom: '8px' }}>
              TRUTH &amp; HOPE GALA 2026
            </h1>
            <div className="divider-gold fade-up-3" style={{ marginBottom: '12px' }} />
            <p className="hero-body fade-up-4" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)', color: 'white', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Strengthening Public Schools in Nepal
            </p>
            <p className="fade-up-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, margin: '0 auto 20px' }}>
              Because Nepal's public schools are more than institutions of learning. They are spaces where the future of the nation quietly takes shape each day.
            </p>
            <div className="fade-up-5">
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>
        </div>

        {/* ── Red band: venue + date only ─────────────────────────── */}
        <div className="venue-band fade-up-6" style={{ width: '100%', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: 'white', whiteSpace: 'nowrap' }}>
              Hotel Yak &amp; Yeti
            </span>
            <span style={{ width: '1px', height: '26px', background: 'rgba(255,255,255,0.4)', display: 'block' }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: 'white', whiteSpace: 'nowrap' }}>
              10 April, 2026
            </span>
          </div>
        </div>

        {/* ── Children image + buttons overlay ──────────────────────── */}
        <div style={{ position: 'relative', width: '100%', flex: '1 1 50%', minHeight: '300px', overflow: 'hidden' }}>
          {/* Flat tab-style buttons attached to the top of the image */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            gap: 0,
            borderTop: '4px solid #d71a21',
            background: '#084691',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)'
          }}>
            <a href="https://forms.gle/your-google-form-link" target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '14px 0',
                color: 'rgba(255,255,255,0.92)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: '0.98rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: 'none',
                background: '#084691',
                outline: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background 0.18s, color 0.18s',
                borderRight: '1px solid rgba(255,255,255,0.08)'
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#06376e')}
              onMouseOut={e => (e.currentTarget.style.background = '#084691')}
            >
              Book Tickets
            </a>
            <button onClick={() => setShowVideo(true)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '14px 0',
                color: 'rgba(255,255,255,0.92)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: '0.98rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: 'none',
                background: '#084691',
                outline: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                transition: 'background 0.18s, color 0.18s',
                borderRight: '1px solid rgba(255,255,255,0.08)'
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#06376e')}
              onMouseOut={e => (e.currentTarget.style.background = '#084691')}
            >
              <Play style={{ width: 13, height: 13 }} />
              Watch 2025 Highlights
            </button>
            <a href="#about-gala"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '14px 0',
                color: 'rgba(255,255,255,0.92)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: '0.98rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: 'none',
                background: '#084691',
                outline: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background 0.18s, color 0.18s',
                borderRight: '1px solid rgba(255,255,255,0.08)'
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#06376e')}
              onMouseOut={e => (e.currentTarget.style.background = '#084691')}
            >About the Gala</a>
            <a href="/program"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '14px 0',
                color: 'rgba(255,255,255,0.92)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: '0.98rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: 'none',
                background: '#084691',
                outline: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background 0.18s, color 0.18s'
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#06376e')}
              onMouseOut={e => (e.currentTarget.style.background = '#084691')}
            >Program Details</a>
          </div>
          <img
            src="/images/home_bottom_image_short.png"
            alt="Children studying at school in Nepal"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom', filter: 'grayscale(1)', display: 'block' }}
          />
          {/* Gradient overlay — heavier at bottom so buttons are readable */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.65) 100%)'
          }} />
        </div>

        {/* ── Video Modal ────────────────────────────────────────────── */}
        {showVideo && (
          <div
            onClick={() => setShowVideo(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '16/9' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShowVideo(false)}
                style={{ position: 'absolute', top: '-44px', right: 0, background: 'none', border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", opacity: 0.7 }}
              >
                ✕ Close
              </button>
              <iframe
                width="100%" height="100%"
                src="https://www.youtube.com/embed/u1OCCza-Nl0?autoplay=1"
                title="Gala 2025 Highlights"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: '12px' }}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Hero2;