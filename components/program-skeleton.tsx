import React from "react";

export default function ProgramSkeleton({ count = 4 }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", width: "100%", margin: "0 auto" }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            flex: "1 1 350px",
            minWidth: 350,
            maxWidth: 500,
            background: "#eef3fb",
            borderRadius: 16,
            boxShadow: "0 4px 20px #22589820, 0 1px 4px #0001",
            border: "1px solid #c8d9f0",
            borderTop: "5px solid #d71a21",
            color: "#084691",
            padding: "2rem 1.5rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "relative",
            overflow: "hidden",
            minHeight: 180,
            opacity: 0.85,
            animation: "pulse 1.6s infinite ease-in-out",
          }}
        >
          {/* Sequence Badge */}
          <div style={{
            position: "absolute",
            top: 18,
            left: 18,
            background: "#d71a21",
            color: "#fff",
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 17,
            boxShadow: "0 2px 8px #0003",
            zIndex: 3,
            border: "2px solid #fff2",
            opacity: 0.7,
          }} />
          {/* Title skeleton */}
          <div style={{ width: "70%", height: 28, background: "#c8d9f0", borderRadius: 8, marginBottom: 16 }} />
          {/* Subtitle skeleton */}
          <div style={{ width: "50%", height: 18, background: "#dbe6f7", borderRadius: 6, marginBottom: 12 }} />
          {/* Description skeleton */}
          <div style={{ width: "90%", height: 14, background: "#e6ecf7", borderRadius: 6, marginBottom: 8 }} />
          <div style={{ width: "80%", height: 14, background: "#e6ecf7", borderRadius: 6, marginBottom: 8 }} />
          <div style={{ width: "60%", height: 14, background: "#e6ecf7", borderRadius: 6, marginBottom: 8 }} />
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
