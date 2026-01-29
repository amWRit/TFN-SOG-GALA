import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
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
          <div
            key={item.id}
            style={{
              background: "rgba(36,24,64,0.93)",
              borderRadius: 32,
              boxShadow: "0 8px 32px #0005",
              color: "#fff",
              width: "min(100%, 370px)",
              minHeight: 320,
              padding: "2rem 1.5rem 1.5rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 18, marginBottom: 16 }}
              />
            )}
            <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>{item.title}</span>
              {item.externalLink && (
                <a href={item.externalLink} target="_blank" rel="noopener noreferrer" style={{ color: "#F472B6", marginLeft: 8 }} aria-label="External Link">
                  <ExternalLink size={22} />
                </a>
              )}
            </div>
            <div style={{ color: "#F472B6", fontWeight: 600, fontSize: 15, margin: "0.5rem 0 0.2rem 0" }}>{item.type}</div>
            <div style={{ fontSize: 15, color: "#fff", opacity: 0.85, marginBottom: 8 }}>
              {truncate(item.description, 90)}
            </div>
            <div style={{ fontSize: 14, color: "#fff", marginBottom: 6 }}>
              <b>Time:</b> {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            {item.speaker && (
              <div style={{ fontSize: 14, color: "#fff", marginBottom: 6 }}>
                <b>Speaker:</b> {item.speaker}
              </div>
            )}
            <div style={{ fontSize: 13, color: "#fff", opacity: 0.7, marginTop: "auto" }}>
              {item.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
