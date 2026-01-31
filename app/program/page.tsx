"use client";
import React, { useState, useEffect } from "react";
import ProgramCard from "../../components/program-card";
import ProgramModal from "../../components/program-modal";
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
  const [selected, setSelected] = useState<any | null>(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    fetchProgram().then(setProgram).catch(() => setProgram([]));
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.heroContainer} style={{ minHeight: "100vh", padding: 0, paddingBottom: '3rem' }}>
      {/* Home Button */}
      <div style={{ position: "fixed", top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 1.25rem', background: 'rgba(255,255,255,0.92)', color: '#23272F', borderRadius: 9999, fontWeight: 600, boxShadow: '0 2px 12px #0002', border: '1px solid #eee', textDecoration: 'none', fontSize: 18 }}>
          <Home size={20} /> Home
        </a>
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "4.5rem 0 1.5rem 0", letterSpacing: 1 }}>Event Program</h1>
      {/* Removed instruction text for cleaner layout */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", width: "100%", margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        {program.map((item: any) => (
          <div key={item.id} style={{ cursor: "pointer", flex: "1 1 350px", minWidth: 350, maxWidth: 500 }} onClick={() => setSelected(item)}>
            <ProgramCard item={item} truncate={truncate} />
          </div>
        ))}
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
            background: 'rgba(36,24,64,0.97)',
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
