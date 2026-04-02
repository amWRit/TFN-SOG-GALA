"use client";
import React, { useEffect, useRef } from "react";

const COLORS = ["#FFD700", "#FF4136", "#2ECC40", "#0074D9", "#FF69B4", "#FF851B", "#7FDBFF", "#B10DC9"];
const SHAPES = ["square", "circle", "strip"];
const PIECE_COUNT = 80;

interface ConfettiPiece {
  id: number;
  color: string;
  shape: string;
  left: number;    // %
  delay: number;   // s
  duration: number; // s
  size: number;    // px
  rotate: number;  // deg
  rotateSpeed: number;
  drift: number;   // px horizontal drift per fall
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generatePieces(): ConfettiPiece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    left: randomBetween(0, 100),
    delay: randomBetween(0, 4),
    duration: randomBetween(3.5, 7),
    size: randomBetween(8, 16),
    rotate: randomBetween(0, 360),
    rotateSpeed: randomBetween(200, 600),
    drift: randomBetween(-60, 60),
  }));
}

export default function FallingConfetti() {
  const pieces = useRef<ConfettiPiece[]>(generatePieces());

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {pieces.current.map((p) => {
        const isStrip = p.shape === "strip";
        const isCircle = p.shape === "circle";
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              top: `-${p.size * 2}px`,
              left: `${p.left}%`,
              width: isStrip ? `${p.size * 0.4}px` : `${p.size}px`,
              height: isStrip ? `${p.size * 2.5}px` : `${p.size}px`,
              background: p.color,
              borderRadius: isCircle ? "50%" : isStrip ? "2px" : "2px",
              opacity: 0,
              animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in infinite`,
              // Use CSS custom properties for per-piece drift and rotate
              // @ts-ignore
              "--drift": `${p.drift}px`,
              "--rotate": `${p.rotate}deg`,
              "--rotate-end": `${p.rotate + 360}deg`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(var(--rotate));
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) translateX(var(--drift)) rotate(var(--rotate-end));
          }
        }
      `}</style>
    </div>
  );
}
