"use client";
import React, { useEffect, useRef, useState } from "react";

const COLORS = ["#FFD700", "#FF4136", "#2ECC40", "#0074D9", "#FF69B4", "#FF851B", "#B10DC9", "#7FDBFF", "#fff"];
const PIECE_COUNT = 48;

interface Piece {
  id: number;
  color: string;
  angle: number;   // degrees from straight up, spread -70 to +70
  speed: number;   // px per tick
  size: number;
  shape: "circle" | "square" | "strip";
  delay: number;
}

function makePieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    angle: -70 + Math.random() * 140,
    speed: 220 + Math.random() * 260,
    size: 6 + Math.random() * 8,
    shape: (["circle", "square", "strip"] as const)[Math.floor(Math.random() * 3)],
    delay: Math.random() * 0.12,
  }));
}

interface Props {
  trigger: number; // increment to fire
}

export default function PopperConfetti({ trigger }: Props) {
  const [active, setActive] = useState(false);
  const pieces = useRef<Piece[]>(makePieces());
  const prevTrigger = useRef(trigger);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      pieces.current = makePieces();
      setActive(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setActive(false), 2200);
    }
  }, [trigger]);

  if (!active) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 10000,
        width: 0,
        height: 0,
      }}
    >
      {pieces.current.map((p) => {
        // Convert angle (0 = straight up) to CSS transform components
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.sin(rad) * p.speed;
        const ty = -Math.cos(rad) * p.speed;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: p.shape === "strip" ? `${p.size * 0.35}px` : `${p.size}px`,
              height: p.shape === "strip" ? `${p.size * 2.5}px` : `${p.size}px`,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              background: p.color,
              opacity: 0,
              animationName: "popper-burst",
              animationDuration: `${0.8 + Math.random() * 0.5}s`,
              animationDelay: `${p.delay}s`,
              animationTimingFunction: "ease-out",
              animationFillMode: "forwards",
              // Per-piece CSS custom properties
              ["--tx" as string]: `${tx}px`,
              ["--ty" as string]: `${ty}px`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        @keyframes popper-burst {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) rotate(540deg) scale(0.4);
          }
        }
      `}</style>
    </div>
  );
}
