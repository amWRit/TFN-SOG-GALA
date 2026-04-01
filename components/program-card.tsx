
import React from "react";
import Image from "next/image";
import { Tag } from "lucide-react";


interface ProgramCardProps {
  item: any;
  truncate?: (str: string, n: number) => string;
}

const defaultTruncate = (str: string, n: number) =>
  str && str.length > n ? str.slice(0, n) + "..." : str;

const ProgramCard: React.FC<ProgramCardProps> = ({ item, truncate = defaultTruncate }) => (
  <div
    style={{
      background: "#eef3fb",
      borderRadius: 16,
      boxShadow: "0 4px 20px #22589820, 0 1px 4px #0001",
      border: "1px solid #c8d9f0",
      borderTop: "5px solid #d71a21",
      color: "#084691",
      width: "min(100%, 500px)",
      minHeight: 0,
      padding: "2rem 1.5rem 1.5rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: 'pointer',
      touchAction: 'manipulation',
    }}
    onMouseOver={e => { e.currentTarget.style.boxShadow = '0 10px 32px #22589830, 0 2px 8px #0002'; e.currentTarget.style.transform = 'scale(1.018)'; }}
    onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 20px #22589820, 0 1px 4px #0001'; e.currentTarget.style.transform = 'scale(1)'; }}
    onTouchStart={e => { e.currentTarget.style.boxShadow = '0 10px 32px #22589830, 0 2px 8px #0002'; e.currentTarget.style.transform = 'scale(1.018)'; }}
    onTouchEnd={e => { e.currentTarget.style.boxShadow = '0 4px 20px #22589820, 0 1px 4px #0001'; e.currentTarget.style.transform = 'scale(1)'; }}
  >
    {/* Sequence Badge */}
    {typeof item.sequence !== 'undefined' && (
      <div
        style={{
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
        }}
        title="Sequence Number"
      >
        {item.sequence}
      </div>
    )}
    {/* Program Image */}
    <div style={{ width: "100%", height: 120, position: "relative", borderRadius: 18, marginBottom: 16, overflow: "hidden" }}>
      <Image
        src={item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "/images/programplaceholder.jpg"}
        alt={item.title}
        fill
        style={{ objectFit: "cover", borderRadius: 18 }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
      />
    </div>
    <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
      <span
        style={{
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: 0.5,
          maxWidth: "90%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          color: "#084691",
        }}
      >
        {item.title}
      </span>
      {/* External link removed */}
    </div>
    <div style={{ color: "#d71a21", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
      <Tag size={13} />
      <span>{item.type}</span>
    </div>
  </div>
);

export default ProgramCard;
