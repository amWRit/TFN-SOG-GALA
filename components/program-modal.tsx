import React from "react";
// import styles from "../styles/homepage.module.css";
import { X, Calendar, MapPin, Info, ExternalLink as ExternalLinkIcon, Hash, Tag, User } from "lucide-react";

type ProgramItem = {
  id: string | number;
  title: string;
  startTime?: string;
  endTime?: string;
  type?: string;
  speaker?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  externalLink?: string;
  sequence?: number;
};

interface ProgramModalProps {
  open: boolean;
  onClose: () => void;
  item: ProgramItem | null;
}

export default function ProgramModal({ open, onClose, item }: ProgramModalProps) {
  if (!open || !item) return null;

    const [descOpen, setDescOpen] = React.useState(false);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        style={{
          background: "rgba(36,24,64,0.99)",
          borderRadius: 32,
          boxShadow: "0 12px 48px #0008",
          color: "#fff",
          width: "min(100vw, 540px)",
          maxWidth: 540,
          padding: "2.5rem 2rem 2rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          position: "relative",
          overflow: "auto",
          maxHeight: "90vh",
        }}
      >
        {/* Sequence Badge */}
        {typeof item.sequence !== 'undefined' && (
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              background: "#F472B6",
              color: "#fff",
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 20,
              boxShadow: "0 2px 8px #0003",
              zIndex: 3,
              border: "3px solid #fff2",
            }}
            title="Sequence Number"
          >
            {item.sequence}
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 22,
            right: 22,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            zIndex: 2,
          }}
          aria-label="Close"
        >
          <X size={32} />
        </button>
        {/* Image */}
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              borderRadius: 24,
              marginBottom: 18,
              boxShadow: "0 4px 24px #0005"
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 180,
              borderRadius: 24,
              marginBottom: 18,
              background: "linear-gradient(135deg, #F472B6 0%, #60A5FA 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: 1
            }}
            aria-label="No image available"
          >
            No Image
          </div>
        )}
        {/* Title */}
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 8, lineHeight: 1.2 }}>{item.title || 'No Title'}</h2>
        {/* Type and Sequence */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <span style={{ color: "#F472B6", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <Tag size={18} /> {item.type || 'No Type'}
          </span>
        </div>
        {/* Time */}
        <div style={{ fontSize: 15, color: "#fff", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <Calendar size={16} style={{ marginRight: 4, verticalAlign: "middle" }} />
          <span>
            {item.startTime && item.endTime
              ? `${new Date(item.startTime).toLocaleString()} - ${new Date(item.endTime).toLocaleString()}`
              : "Time not available"}
          </span>
        </div>
        {/* Speaker */}
        <div style={{ fontSize: 15, color: "#fff", opacity: 0.8, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <User size={16} style={{ marginRight: 4, verticalAlign: "middle" }} /> Host/Speaker: {item.speaker ? item.speaker : '--'}
        </div>
        {/* Location */}
        <div style={{ fontSize: 15, color: "#fff", opacity: 0.8, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <MapPin size={16} style={{ marginRight: 4, verticalAlign: "middle" }} /> {item.location ? item.location : '--'}
        </div>
        {/* External Link */}
        <div style={{ color: "#F472B6", fontWeight: 600, fontSize: 15, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <ExternalLinkIcon size={18} />
          {item.externalLink ? (
            <a
              href={item.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#F472B6", textDecoration: "underline" }}
            >
              {item.externalLink}
            </a>
          ) : '--'}
        </div>
        {/* Collapsible Description (always show, fallback NA) */}
        <div style={{ marginTop: 14, background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Info size={18} style={{ color: "#F472B6" }} />
            <button
              onClick={() => setDescOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                color: "#F472B6",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
              }}
              aria-expanded={descOpen}
            >
              {descOpen ? 'Hide Description' : 'Show Description'}
            </button>
          </div>
          {descOpen && (
            <div style={{ fontSize: 15, color: "#fff", lineHeight: 1.5, textAlign: "left" }}>{item.description ? item.description : 'NA'}</div>
          )}
        </div>
      </div>
    </div>
  );
}
