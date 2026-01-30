import React from "react";


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
      minHeight: 0,
      padding: "2rem 1.5rem 1.5rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
  >
    {item.imageUrl ? (
      <img
        src={item.imageUrl}
        alt={item.title}
        style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 18, marginBottom: 16 }}
      />
    ) : (
      <div
        style={{
          width: "100%",
          height: 120,
          borderRadius: 18,
          marginBottom: 16,
          background: "linear-gradient(135deg, #F472B6 0%, #60A5FA 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
          fontSize: 20,
          letterSpacing: 1
        }}
        aria-label="No image available"
      >
        No Image
      </div>
    )}
    <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
      <span
        style={{
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 0.5,
          maxWidth: "90%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block"
        }}
      >
        {item.title}
      </span>
      {/* External link removed */}
    </div>
    <div style={{ color: "#F472B6", fontWeight: 600, fontSize: 15 }}>{item.type}</div>
    <div style={{ fontSize: 14, color: "#fff", marginTop: 2 }}>{/* small margin for separation */}
      <b>Time:</b> {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
    {/* Speaker removed */}
    {/* Location removed */}
  </div>
);

export default ProgramCard;
