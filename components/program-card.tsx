import React from "react";
import { ExternalLink } from "lucide-react";

interface ProgramCardProps {
  item: any;
  truncate?: (str: string, n: number) => string;
}

const defaultTruncate = (str: string, n: number) =>
  str && str.length > n ? str.slice(0, n) + "..." : str;

const ProgramCard: React.FC<ProgramCardProps> = ({ item, truncate = defaultTruncate }) => (
  <div
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
);

export default ProgramCard;
