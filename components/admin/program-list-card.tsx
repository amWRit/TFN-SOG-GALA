import React from "react";
import styles from "../../styles/admin-dashboard.module.css";


import { GripVertical, Eye } from "lucide-react";

interface ProgramListCardProps {
  item: any;
  onView: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}


const ProgramListCard: React.FC<ProgramListCardProps> = ({ item, onView, dragHandleProps }) => {
  // Make the card clickable except for drag handle and Eye button
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent click if drag handle or Eye button is clicked
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-drag-handle]') ||
      target.closest('[data-eye-button]')
    ) {
      return;
    }
    onView();
  };

  return (
    <div
      className={styles.auctionCard + " glass-strong flex items-center justify-between px-6 py-4 mb-2 rounded-xl transition border border-[#D4AF37]/40 cursor-pointer"}
      style={{ minHeight: 64 }}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label="Open Program Details"
    >
      <div className="flex items-center gap-2 w-full flex-wrap">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="flex items-center justify-center cursor-grab active:cursor-grabbing text-[#D4AF37]"
          style={{ touchAction: 'none' }}
          tabIndex={-1}
          aria-label="Drag to reorder"
          data-drag-handle
        >
          <GripVertical size={22} />
        </div>
        <div className="text-2xl font-bold text-[#D4AF37] w-10 text-center select-none">{item.sequence}</div>
        <div className="flex-1 min-w-0 flex items-center gap-1 overflow-hidden">
          <span className="font-semibold text-lg text-white truncate block mr-4" title={item.title} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 320, maxWidth: 320, minWidth: 220, display: 'inline-block' }}>{item.title}</span>
          <span className="hidden md:inline text-sm text-gray-400 font-normal whitespace-nowrap mr-1" style={{ width: 140, maxWidth: 140, minWidth: 140, display: 'inline-block' }}>
            {(() => {
              const formatTime = (t: any) => {
                if (!t) return null;
                const d = new Date(t);
                return isNaN(d.getTime()) ? null : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
              };
              const start = formatTime(item.startTime);
              const end = formatTime(item.endTime);
              if (start && end) return `${start} - ${end}`;
              if (start) return `${start} - —`;
              if (end) return `— - ${end}`;
              return '—';
            })()}
          </span>
            {item.type && (
              <span className="hidden md:inline px-2 py-0.5 ml-2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold whitespace-nowrap" style={{ display: 'inline-block' }}>
              {item.type}
            </span>
          )}
          <button
            className={styles.iconButton + " ml-auto flex-shrink-0"}
            onClick={e => { e.stopPropagation(); onView(); }}
            title="View Details"
            aria-label="View Details"
            data-eye-button
          >
            <Eye size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramListCard;
