"use client";
import { Card } from "@/components/ui/card";
import { Pencil, Gavel, Trash2, Pause, Play, Activity, MoreVertical } from "lucide-react";
import { OkModal } from "@/components/admin/ok-modal";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import styles from '../../styles/admin-dashboard.module.css';

interface AuctionItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date | null;
  isActive: boolean;
}

interface AuctionItemAdminCardProps {
  item: AuctionItem;
  onEdit: (item: AuctionItem) => void;
  onAddBid: (item: AuctionItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (item: AuctionItem) => void;
  onShowHistory: (item: AuctionItem) => void;
  deleteId: string | null;
  deleting: boolean;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

export function AuctionItemAdminCard({
  item,
  onEdit,
  onAddBid,
  onDelete,
  onToggleActive,
  onShowHistory,
  deleteId,
  deleting,
  confirmDelete,
  cancelDelete
}: AuctionItemAdminCardProps) {
  return (
    <Card className="glass-strong p-4 relative">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-playfair text-lg font-bold text-[#D4AF37] break-words max-w-[70%]">
          {item.title}
        </h3>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 transition flex items-center justify-center flex-shrink-0"
              title="Actions"
            >
              <MoreVertical size={20} className="text-[#D4AF37]" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="z-50 min-w-[100px] rounded-md bg-[#232323] p-2 shadow-lg border border-[#D4AF37]/30">
            <DropdownMenu.Item onSelect={() => onAddBid(item)} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[#D4AF37]/10 cursor-pointer text-[#f5f5f5]/80">
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
      <div className="text-sm text-[#f5f5f5]/80 mb-1">
        Current Bid: NPR {item.currentBid.toLocaleString()}
      </div>
      <div className="text-xs text-[#f5f5f5]/60 mb-2">
        Current Bidder: {item.currentBidder ? item.currentBidder : 'NA'}
      </div>
      {/* Pause/Play moved to dropdown menu */}
    </Card>
  );
}
