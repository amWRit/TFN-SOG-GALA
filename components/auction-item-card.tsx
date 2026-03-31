"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Clock, Gavel, Expand } from "lucide-react";
import { BidModal } from "@/components/auction-bid-modal";
import { AuctionDescModal } from "@/components/auction-desc-modal";
import { ContactModal } from "@/components/ContactModal";

// Simple image zoom modal using Next.js Image
function ImageZoomModal({ open, imageUrl, title, onClose }: { open: boolean, imageUrl: string, title: string, onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="relative bg-white rounded-lg shadow-lg p-2 w-full max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative flex items-center justify-center w-full h-full"
          style={{ aspectRatio: '4/3', width: '100%', maxWidth: '90vw', maxHeight: '80vh' }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="rounded-lg object-contain"
            style={{ objectFit: 'contain' }}
            sizes="90vw"
            priority
          />
        </div>
        <button className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl font-bold" onClick={onClose} aria-label="Close">&times;</button>
      </div>
    </div>
  );
}

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
  patron?: string | null;
}

interface AuctionItemCardProps {
  item: AuctionItem;
}

function formatTimeRemaining(endTime: Date | null): string {
  if (!endTime) return "No time limit";
  
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;

  if (diff <= 0) return "Closed";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${seconds}s`;
}

// CollapsibleDescription for auction card (must be at module scope)

function DescriptionPreview({ description, title, onReadMore }: { description: string, title: string, onReadMore: () => void }) {
  const isLong = description.length > 120;
  return (
    <div className="text-[#225898] text-sm mt-1">
      <span className="whitespace-pre-line">
        {isLong ? description.slice(0, 120) + "..." : description}
      </span>
      {isLong && (
        <button
          className="ml-2 text-[#d71a21] hover:underline font-semibold focus:outline-none"
          type="button"
          onClick={e => { e.stopPropagation(); onReadMore(); }}
        >
          Read more
        </button>
      )}
    </div>
  );
}

export function AuctionItemCard({ item }: AuctionItemCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(item.endTime));
  const [showBidModal, setShowBidModal] = useState(false);
  const [showDescModal, setShowDescModal] = useState(false);
  const [showPatronModal, setShowPatronModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      // Check server session
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setIsAdmin(data.authenticated === true);
      setCheckingAdmin(false);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!item.endTime || !item.isActive) return;
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(item.endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [item.endTime, item.isActive]);

  const isClosed = !item.isActive || (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime());

  if (checkingAdmin) {
    return (
      <div className="h-72 rounded-2xl bg-gray-100 border border-gray-200 animate-pulse flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d71a21]" />
      </div>
    );
  }

  return (
    <>
      {/* Bid Modal */}
      {showBidModal && (
        <BidModal item={item} onClose={() => setShowBidModal(false)} />
      )}
      {/* Description Modal for The Piece */}
      {showDescModal && (
        <AuctionDescModal
          title={item.title}
          description={item.description ?? ""}
          onClose={() => setShowDescModal(false)}
        />
      )}
      {/* Patron Modal */}
      {showPatronModal && (
        <AuctionDescModal
          title={item.title}
          description={item.patron && item.patron.trim() !== "" ? item.patron : "No patron information available."}
          onClose={() => setShowPatronModal(false)}
        />
      )}
      {/* Contact Modal for non-admin users (kept for future use, not triggered) */}
      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
      {/* Image Zoom Modal for non-admins */}
      <ImageZoomModal
        open={showImageZoom}
        imageUrl={item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "/images/auctionitemplateholder.jpg"}
        title={item.title}
        onClose={() => setShowImageZoom(false)}
      />
      <Card
        className={`group relative border overflow-hidden transition-all duration-300 rounded-2xl ${
          isClosed
            ? "border-gray-200 opacity-70 cursor-default"
            : "border-gray-200 cursor-pointer hover:border-[#d71a21] hover:shadow-xl hover:shadow-[#d71a21]/15 hover:-translate-y-1"
        }`}
        style={{ background: '#eef3fb', borderTop: '5px solid #d71a21' }}
        onClick={() => {
          if (isAdmin) {
            window.open(`/auction/${item.id}`, '_blank');
          } else if (!isClosed && !showDescModal && !showBidModal && !showContactModal && !showImageZoom) {
            setShowImageZoom(true);
          }
        }}
        tabIndex={isClosed ? -1 : 0}
        role="button"
        aria-disabled={isClosed ? true : undefined}
      >
      {/* Image — always shown, fallback if no imageUrl */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "/images/auctionitemplateholder.jpg"}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Expand icon for zoom, only for non-admin and open items */}
        {!isAdmin && !isClosed && (
          <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
            <Expand size={22} className="text-[#084691]" />
          </div>
        )}
        {isClosed ? (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-2 bg-gray-800/90 backdrop-blur-sm text-gray-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Auction Closed
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full bg-[#d71a21] text-white text-xs font-bold uppercase shadow-lg animate-pulse">
              Live
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2 pt-4">
          <CardTitle className="line-clamp-2 text-[#084691] text-xl font-extrabold leading-snug" style={{ textShadow: '0 2px 8px rgba(8,70,145,0.18), 0 1px 0 #fff' }}>{item.title}</CardTitle>
        {/* The Piece section */}
        <div className="mt-2">
          <div className="text-base text-[#084691] font-bold mb-0.5">The Piece</div>
          <div className="text-[#225898] text-sm font-normal">
            <DescriptionPreview
              description={item.description && item.description.trim() !== "" ? item.description : "Information not available."}
              title={item.title}
              onReadMore={() => setShowDescModal(true)}
            />
          </div>
        </div>
        {/* The Patron section */}
        <div className="mt-2">
          <div className="text-base text-[#084691] font-bold mb-0.5">The Patron</div>
          <div className="text-[#225898] text-sm font-normal">
            <DescriptionPreview
              description={item.patron && item.patron.trim() !== "" ? item.patron : "Information not available."}
              title={item.title}
              onReadMore={() => setShowPatronModal(true)}
            />
          </div>
        </div>
        {/* Divider above price section */}
        <div className="border-t border-[#084691]/20 mt-4 mb-2" />
        {/* Actual Price & Start Bid row */}
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex flex-col items-start">
            <span className="text-xs text-[#084691] uppercase tracking-wider mb-0.5">Actual Price</span>
            <span className="font-playfair text-lg font-bold" style={{ color: '#D4AF37' }}>NPR {item.actualPrice?.toLocaleString?.() ?? 'NA'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-[#084691] uppercase tracking-wider mb-0.5">Start Bid</span>
            <span className="font-playfair text-lg font-bold" style={{ color: '#D4AF37' }}>NPR {item.startingBid?.toLocaleString?.() ?? 'NA'}</span>
          </div>
        </div>
      </CardHeader>

      {/* Divider */}
      <div className="border-t border-[#084691]/20 mt-4 mb-2" />

      <CardContent className="pt-0">
        {/* Current Bid and Leading in a single row, aligned center */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex flex-col items-start">
            <span className="text-xs text-[#084691] uppercase tracking-wider mb-0.5">Current Bid</span>
            <span className="font-playfair text-lg font-bold" style={{ color: '#D4AF37' }}>NPR {item.currentBid.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-[#084691] uppercase tracking-wider mb-0.5">Leading</span>
            {item.currentBidder ? (
              <span className="font-playfair text-lg font-bold" style={{ color: '#D4AF37' }}>{item.currentBidder}</span>
            ) : (
              <span className="font-playfair text-lg font-bold" style={{ color: '#D4AF37' }}>
                No bids yet
              </span>
            )}
          </div>
        </div>

        {/* Action hint */}
        <div className="mt-4 flex justify-center">
          {isAdmin ? (
            <div className="text-[#d71a21] font-medium flex items-center gap-1.5 text-xs">
              <Eye size={14} /> Click to view details
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
    </>
  );
}
