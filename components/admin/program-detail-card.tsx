import React from "react";
import { Pencil, Trash2 } from "lucide-react";

interface ProgramDetailCardProps {
  item: any;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const ProgramDetailCard: React.FC<ProgramDetailCardProps> = ({ item, className = "", onEdit, onDelete, isAdmin }) => (
  <div className={className} style={{ maxWidth: 420, width: "100%", background: isAdmin ? "#18181b" : "rgba(36,24,64,0.93)", borderRadius: 24, boxShadow: isAdmin ? "0 4px 32px #0008" : "0 8px 32px #0005", color: isAdmin ? "#fff" : undefined, padding: "2.5rem 2rem 2rem 2rem", position: "relative" }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontWeight: 700, fontSize: 26, color: isAdmin ? "#D4AF37" : "#fff", marginBottom: 6 }}>{item.title}</div>
      <div style={{ color: isAdmin ? "#aaa" : "#F472B6", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{item.type}</div>
      <div style={{ fontSize: 15, color: isAdmin ? "#fff" : "#fff", opacity: 0.85, marginBottom: 8 }}>{item.description}</div>
      <div style={{ fontSize: 14, color: isAdmin ? "#fff" : "#fff", marginBottom: 6 }}>
        <b>Time:</b> {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      {item.speaker && (
        <div style={{ fontSize: 14, color: isAdmin ? "#fff" : "#fff", marginBottom: 6 }}>
          <b>Speaker:</b> {item.speaker}
        </div>
      )}
      {item.speakerBio && (
        <div style={{ fontSize: 13, color: isAdmin ? "#fff" : "#fff", opacity: 0.7, marginBottom: 6 }}>
          {item.speakerBio}
        </div>
      )}
      <div style={{ fontSize: 13, color: isAdmin ? "#fff" : "#fff", opacity: 0.7, marginBottom: 6 }}>{item.location}</div>
      {item.externalLink && (
        <a href={item.externalLink} target="_blank" rel="noopener noreferrer" style={{ color: isAdmin ? "#D4AF37" : "#F472B6", fontWeight: 500, fontSize: 15, marginBottom: 8, display: 'inline-block' }}>
          External Link
        </a>
      )}
    </div>
    {isAdmin && (
      <div className="flex gap-3 mt-4">
        <button onClick={onEdit} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#18181b] font-semibold hover:bg-[#bfa43a] transition">
          <Pencil size={18} /> Edit
        </button>
        <button onClick={onDelete} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition">
          <Trash2 size={18} /> Delete
        </button>
      </div>
    )}
  </div>
);

export default ProgramDetailCard;
