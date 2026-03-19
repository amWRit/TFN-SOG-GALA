import React from "react";

export default function SeatingSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            borderRadius: 24,
            boxShadow: "0 4px 20px #22589820, 0 1px 4px #0001",
            color: "#084691",
            minHeight: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            opacity: 0.85,
            animation: "pulse 1.6s infinite ease-in-out",
          }}
        >
          {/* Skeleton: big circle (table) and small circles (seats) */}
          <div style={{ position: "relative", width: 256, height: 256, margin: "auto", marginTop: "auto", marginBottom: "auto" }}>
            {/* Big central circle */}
            <div style={{ position: "absolute", left: 64, top: 64, width: 128, height: 128, borderRadius: "50%", background: "#d71a21", opacity: 0.15, border: "4px solid #d71a21", boxShadow: "0 2px 12px #d71a2133" }} />
            {/* Small circles around (seats) */}
            {Array.from({ length: 12 }).map((_, seatIdx) => {
              const angle = (seatIdx / 12) * 2 * Math.PI - Math.PI / 2;
              const radius = 110;
              const x = (Math.cos(angle) * radius + 128 - 16).toFixed(2) + 'px';
              const y = (Math.sin(angle) * radius + 128 - 16).toFixed(2) + 'px';
              return (
                <div
                  key={seatIdx}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#e6ecf7",
                    border: "2px solid #c8d9f0",
                    opacity: "0.6",
                    boxShadow: "0 1px 4px #0001",
                  }}
                />
              );
            })}
          </div>
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
