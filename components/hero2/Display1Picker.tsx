'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface AuctionItem {
  id: number;
  title: string;
  sequence?: number | null;
}

interface Display1PickerProps {
  onClose: () => void;
}

export default function Display1Picker({ onClose }: Display1PickerProps) {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auction/items')
      .then((r) => r.json())
      .then((data: AuctionItem[]) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  function handleSelect(id: number) {
    window.open(`/display1?id=${id}`, '_blank');
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #D4AF37',
        borderRadius: 12,
        padding: '24px',
        minWidth: 320,
        maxWidth: 480,
        width: '90%',
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#FFD700', fontWeight: 700, fontSize: '1rem' }}>
            Select Auction Item for Display 1
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading && (
            <div style={{ color: '#888', textAlign: 'center', padding: 24 }}>Loading…</div>
          )}
          {!loading && items.length === 0 && (
            <div style={{ color: '#888', textAlign: 'center', padding: 24 }}>No auction items found.</div>
          )}
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              style={{
                background: '#2a2a2a',
                border: '1px solid #333',
                borderRadius: 8,
                color: '#fff',
                padding: '12px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#333';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4AF37';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#2a2a2a';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#333';
              }}
            >
              {item.sequence != null ? `#${item.sequence} — ` : ''}{item.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
