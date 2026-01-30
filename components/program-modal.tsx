import React from "react";
import styles from "../styles/homepage.module.css";
import { X, Calendar, MapPin, User, Info } from "lucide-react";

type ProgramItem = {
  id: string | number;
  title: string;
  time?: string;
  type?: string;
  speaker?: string;
  location?: string;
  description?: string;
};

interface ProgramModalProps {
  open: boolean;
  onClose: () => void;
  item: ProgramItem | null;
}

export default function ProgramModal({ open, onClose, item }: ProgramModalProps) {
  if (!open || !item) return null;

  return (
    <div className={styles.modalOverlay} style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div className={styles.modalContent} style={{
        background: "#fff", borderRadius: 16, maxWidth: 400, width: "90vw", padding: 24, position: "relative", boxShadow: "0 4px 32px #0003"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer"
        }}>
          <X size={24} />
        </button>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{item.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Calendar size={18} /> <span>{item.time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Info size={18} /> <span>{item.type}</span>
        </div>
        {item.speaker && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <User size={18} /> <span>{item.speaker}</span>
          </div>
        )}
        {item.location && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <MapPin size={18} /> <span>{item.location}</span>
          </div>
        )}
        {item.description && (
          <div style={{ marginTop: 12 }}>
            <strong>Description:</strong>
            <p style={{ margin: 0 }}>{item.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
