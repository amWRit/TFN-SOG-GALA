'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import NotFound from '@/components/NotFound';

export default function Display3() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [leftWidth, setLeftWidth] = useState(600);
  const [isDragging, setIsDragging] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const auctionSrc = id ? `/auction/${id}` : '/auction';

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.authenticated === true))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    setLeftWidth(window.innerWidth / 2);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';

    const handleMouseMove = (e: MouseEvent) => {
      const min = 200;
      const max = window.innerWidth - 200;
      const newLeft = Math.min(Math.max(e.clientX, min), max);
      setLeftWidth(newLeft);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (checking) return null;
  if (!isAdmin) return <NotFound />;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', userSelect: 'none' }}>
      <iframe
        src={auctionSrc}
        style={{ width: leftWidth, border: 'none', height: '100%', flexShrink: 0 }}
      />
      <div
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        style={{
          width: 8,
          flexShrink: 0,
          cursor: 'col-resize',
          background: isDragging ? '#FFD700' : '#b8960c',
          zIndex: 10,
          transition: isDragging ? 'none' : 'background 0.2s',
        }}
      />
      <iframe
        src="/progress"
        style={{ flex: 1, border: 'none', height: '100%' }}
      />
      {isDragging && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'col-resize' }} />
      )}
    </div>
  );
}
