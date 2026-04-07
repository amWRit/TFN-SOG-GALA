"use client";
import { Card } from "@/components/ui/card";
import { Pencil, Gavel, Trash2, Pause, Play, Activity, MoreVertical, GripVertical } from "lucide-react";
import { OkModal } from "@/components/admin/ok-modal";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

interface AuctionItem {
  id: string;
  title: string;
  sequence: number;
  patron?: string | null;
  description: string | null;
  imageUrl: string | null;
  actualPrice?: number;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date | null;
  isActive: boolean;
}

interface AuctionItemAdminCardProps {
  item: AuctionItem;
  onView?: (item: AuctionItem) => void;
  onEdit: (item: AuctionItem) => void;
  onAddBid: (item: AuctionItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (item: AuctionItem) => void | Promise<void>;
  onShowHistory: (item: AuctionItem) => void;
  deleteId: string | null;
  deleting: boolean;
  confirmDelete: () => void;
  cancelDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function AuctionItemAdminCard({
  item,
  onView,
  onEdit,
  onAddBid,
  onDelete,
  onToggleActive,
  onShowHistory,
  deleteId,
  deleting,
  confirmDelete,
  cancelDelete,
  dragHandleProps
}: AuctionItemAdminCardProps) {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-drag-handle]') ||
      target.closest('[data-actions-button]') ||
      target.closest('[data-actions-content]')
    ) {
      return;
    }
    onView?.(item);
  };

  return (
    <Card
      className="glass-strong p-4 relative cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label="Open Auction Item Details"
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            {...dragHandleProps}
            className="flex items-center justify-center cursor-grab active:cursor-grabbing text-[#D4AF37]"
            style={{ touchAction: 'none' }}
            tabIndex={-1}
            aria-label="Drag to reorder"
            data-drag-handle
          >
            <GripVertical size={18} />
          </div>
          <div className="hidden sm:block text-lg font-bold text-[#D4AF37] w-8 text-center select-none shrink-0">
            {item.sequence}
          </div>
          <h3
            className="font-playfair text-lg font-bold text-[#f5f5f5] min-w-0 truncate flex-1 md:flex-none md:w-[520px]"
            title={item.title}
          >
            {item.title}
          </h3>
          {/* Hide Actual Price and Starting Bid on md screens, show only on lg+ */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-[#f5f5f5]/80 whitespace-nowrap shrink-0">
            <span className="inline-block w-[190px]">Actual Price: <b>NPR {(item.actualPrice || 0).toLocaleString()}</b></span>
            <span className="inline-block w-[190px]">Starting Bid: <b>NPR {item.startingBid.toLocaleString()}</b></span>
          </div>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 transition flex items-center justify-center flex-shrink-0"
              title="Actions"
              data-actions-button
            >
              <MoreVertical size={20} className="text-[#D4AF37]" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-[1000] min-w-[100px] rounded-md bg-[#232323] p-2 shadow-lg border border-[#D4AF37]/30" data-actions-content>
              <DropdownMenu.Item onSelect={() => onAddBid(item)} disabled={!item.isActive} className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer text-[#f5f5f5]/80 ${item.isActive ? "hover:bg-[#D4AF37]/10" : "opacity-40 cursor-not-allowed pointer-events-none"}`}>
                  <Gavel size={16} className="text-[#D4AF37]" />
                  <span>Bid</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => onShowHistory(item)} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[#D4AF37]/10 cursor-pointer text-[#f5f5f5]/80">
                <Activity size={16} className="text-[#D4AF37]" />
                <span>History</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => onEdit(item)} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[#D4AF37]/10 cursor-pointer text-[#f5f5f5]/80">
                <Pencil size={16} className="text-[#D4AF37]" />
                <span>Edit</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => onToggleActive(item)} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[#D4AF37]/10 cursor-pointer text-[#f5f5f5]/80">
                {item.isActive ? <Pause size={16} className="text-[#D4AF37]" /> : <Play size={16} className="text-[#D4AF37]" />}
                <span>{item.isActive ? 'Pause' : 'Resume'}</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => onDelete(item.id)} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-red-400/10 cursor-pointer">
                <Trash2 size={16} className="text-red-400" />
                <span className="text-red-400">Delete</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <OkModal
          open={!!deleteId}
          title="Delete Auction Item"
          message="Are you sure you want to delete this auction item? This cannot be undone."
          onOk={confirmDelete}
          onCancel={cancelDelete}
          okText={deleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          okDisabled={deleting}
          cancelDisabled={deleting}
        />
      </div>
      {/* Pause/Play moved to dropdown menu */}
    </Card>
  );
}
