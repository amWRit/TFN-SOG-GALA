'use client';



import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NotFound from '@/components/NotFound';
import { Home } from 'lucide-react';

function Display3Inner() {
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
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', userSelect: 'none' }}>
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
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
      </div>
      {isDragging && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'col-resize' }} />
      )}
      {/* Subtle Home icon centered at the bottom */}
      <button
        onClick={() => { if (window.top) window.top.location.href = '/'; }}
        aria-label="Home"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 28,
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.8)',
          border: 'none',
          borderRadius: '50%',
          padding: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          cursor: 'pointer',
          zIndex: 10001,
          transition: 'background 0.2s',
          opacity: 0.5,
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
      >
        <Home size={32} color="#222" style={{ display: 'block' }} />
      </button>
    </div>
  );
}

export default function Display3() {
  return (
    <Suspense>
      <Display3Inner />
    </Suspense>
  );
}
