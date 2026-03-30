"use client";
import React, { useState, useEffect } from "react";
import ProgramCard from "../../components/program-card";
import ProgramModal from "../../components/program-modal";
import ProgramSkeleton from "../../components/program-skeleton";
import { Home } from "lucide-react";
import styles from '../../styles/homepage.module.css';

const truncate = (str: string, n: number) =>
  str && str.length > n ? str.slice(0, n) + "..." : str;

async function fetchProgram() {
  const res = await fetch("/api/program");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function ProgramPage() {
  const [program, setProgram] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [filter, setFilter] = useState('All');

  // Filtering logic for program items
  const filteredProgram = program.filter((item: any) => {
    if (filter === 'All') return true;
    if (filter === 'Speakers') return (item.type?.toLowerCase() === 'speech');
    if (filter === 'Performances') return (item.type?.toLowerCase() === 'performance');
    if (filter === 'Others') return !['speech', 'performance'].includes((item.type || '').toLowerCase());
    return true;
  });

  useEffect(() => {
    setLoading(true);
    fetchProgram()
      .then(data => { setProgram(data); setLoading(false); })
      .catch(() => { setProgram([]); setLoading(false); });
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: 0, paddingBottom: '3rem', background: '#f0f4fa' }}>
      {/* Home Button */}
      <div style={{ position: "fixed", top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 1.25rem', background: '#fff', color: '#084691', borderRadius: 9999, fontWeight: 600, boxShadow: '0 2px 12px #08469130', border: 'none', textDecoration: 'none', fontSize: 18 }}>
          <Home size={20} /> Home
        </a>
      </div>
      {/* Hero section with image and blue gradient */}
      <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[180px] md:min-h-[220px] mb-0 pt-24 pb-4" style={{ borderRadius: 0 }}>
        {/* Background image */}
        <div className="absolute inset-0 bg-gray-900">
          <img
            src="/images/tfnimage2.jpg"
            alt="Program Hero"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        {/* Blue gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#084691]/88 via-[#225898]/75 to-[#084691]/88" />
        <div className="relative z-10 text-center px-4 py-4 w-full max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 max-w-6xl mx-auto" style={{ letterSpacing: 1 }}>
            Event <span className="text-[#d71a21]">Program</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-4xl mx-auto mb-2 break-words">
            Explore the full schedule of the gala, including performances, speakers, and more.
          </p>
        </div>
      </div>
      {/* Pill Filter - now outside hero section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 0,
          padding: 12,
          width: '100%',
          boxSizing: 'border-box',
        }}
        className="pill-filter-bar"
      >
        {['All', 'Speakers', 'Performances'].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            style={{
              padding: '0.4rem 1.2rem',
              borderRadius: 9999,
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              background: filter === label ? '#d71a21' : '#fff',
              color: filter === label ? '#fff' : '#084691',
              boxShadow: filter === label ? '0 2px 8px #d71a2130' : '0 2px 8px #08469120',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 90,
              flex: '0 0 auto',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .pill-filter-bar {
            gap: 8px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            width: 100% !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
      {/* Program cards grid with hero bg */}
      <div className="relative w-full overflow-hidden mb-12">
        {/* Background image */}
        <div className="absolute inset-0 bg-gray-900">
          <img
            src="/images/tfnimage2.jpg"
            alt="Program Grid Hero"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        {/* Blue gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#084691]/88 via-[#225898]/75 to-[#084691]/88" />
        <div className="relative z-10" style={{ padding: 32 }}>
          {loading ? (
            <ProgramSkeleton count={4} />
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", width: "100%", margin: "0 auto" }}>
              {filteredProgram.map((item: any) => (
                <div key={item.id} style={{ cursor: "pointer", flex: "1 1 350px", minWidth: 350, maxWidth: 500 }} onClick={() => setSelected(item)}>
                  <ProgramCard item={item} truncate={truncate} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ProgramModal open={!!selected} onClose={() => setSelected(null)} item={selected} />

      {/* Temporary bottom hint */}
      {showHint && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#084691',
            color: '#fff',
            padding: '0.65rem 1.2rem',
            borderRadius: 9999,
            fontWeight: 500,
            fontSize: 'clamp(13px, 4vw, 16px)',
            boxShadow: '0 2px 12px #0005',
            zIndex: 1000,
            opacity: 0.96,
            transition: 'opacity 0.5s',
            maxWidth: '90vw',
            textAlign: 'center',
            wordBreak: 'break-word',
          }}
        >
          Tap or click a card to view details
        </div>
      )}
    </div>
  );
}
