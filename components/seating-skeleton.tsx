import React from "react";

export default function SeatingSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            background: "#eef3fb",
            borderRadius: 24,
            boxShadow: "0 4px 20px #22589820, 0 1px 4px #0001",
            border: "1px solid #c8d9f0",
            borderTop: "5px solid #d71a21",
            color: "#084691",
            padding: "2.5rem 1.5rem 2rem 1.5rem",
            minHeight: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            opacity: 0.85,
            animation: "pulse 1.6s infinite ease-in-out",
          }}
        >
          {/* Table badge skeleton */}
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#d71a21", opacity: 0.7, marginBottom: 24 }} />
          {/* Table name skeleton */}
          <div style={{ width: "60%", height: 28, background: "#c8d9f0", borderRadius: 8, marginBottom: 16 }} />
          {/* Seats grid skeleton */}
          <div style={{ width: "100%", height: 120, background: "#e6ecf7", borderRadius: 16, marginBottom: 16 }} />
          {/* Subtitle skeleton */}
          <div style={{ width: "40%", height: 18, background: "#dbe6f7", borderRadius: 6, marginBottom: 12 }} />
          {/* Pulse animation */}
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.85; }
              50% { opacity: 0.55; }
              100% { opacity: 0.85; }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
