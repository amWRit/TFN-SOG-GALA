import React from "react";
import styles from "../../styles/admin-dashboard.module.css";


import { GripVertical, Eye } from "lucide-react";

interface ProgramListCardProps {
  item: any;
  onView: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const ProgramListCard: React.FC<ProgramListCardProps> = ({ item, onView, dragHandleProps }) => (
  <div
    className={styles.auctionCard + " glass-strong flex items-center justify-between px-6 py-4 mb-2 rounded-xl transition border border-[#D4AF37]/40"}
    style={{ minHeight: 64 }}
  >
    <div className="flex items-center gap-2 w-full flex-wrap">
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="flex items-center justify-center cursor-grab active:cursor-grabbing text-[#D4AF37]"
        style={{ touchAction: 'none' }}
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <GripVertical size={22} />
      </div>
      <div className="text-2xl font-bold text-[#D4AF37] w-10 text-center select-none">{item.sequence}</div>
      <div className="flex-1 min-w-0 flex items-center gap-1 overflow-hidden">
        <span className="font-semibold text-lg text-white truncate block max-w-[180px] sm:max-w-[220px] md:max-w-[320px] mr-4" title={item.title} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
        <span className="hidden md:inline text-sm text-gray-400 font-normal whitespace-nowrap max-w-[80px] mr-4">
          {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {item.type && (
          <span className="hidden md:inline px-2 py-0.5 ml-2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold whitespace-nowrap">
            {item.type}
          </span>
        )}
        <button
          className={styles.iconButton + " ml-auto flex-shrink-0"}
          onClick={e => { e.stopPropagation(); onView(); }}
          title="View Details"
          aria-label="View Details"
        >
          <Eye size={20} />
        </button>
      </div>
    </div>
  </div>
);

export default ProgramListCard;
