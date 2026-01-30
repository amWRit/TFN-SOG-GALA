import React from "react";
import Link from "next/link";
import ProgramCard from "../../components/program-card";
import { Home } from "lucide-react";
import styles from '../../styles/homepage.module.css';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const truncate = (str: string, n: number) =>
  str && str.length > n ? str.slice(0, n) + "..." : str;

export default async function ProgramPage() {
  const program = await prisma.program.findMany({ orderBy: { sequence: "asc" } });

  return (
    <div className={styles.heroContainer} style={{ minHeight: "100vh", padding: 0 }}>
      {/* Home Button */}
      <div style={{ position: "fixed", top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 1.25rem', background: 'rgba(255,255,255,0.92)', color: '#23272F', borderRadius: 9999, fontWeight: 600, boxShadow: '0 2px 12px #0002', border: '1px solid #eee', textDecoration: 'none', fontSize: 18 }}>
          <Home size={20} /> Home
        </a>
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "4.5rem 0 1.5rem 0", letterSpacing: 1 }}>Event Program</h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        {program.map((item: any) => (
          <ProgramCard key={item.id} item={item} truncate={truncate} />
        ))}
      </div>
    </div>
  );
}
