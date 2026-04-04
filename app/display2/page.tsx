'use client';

import { useEffect, useState } from 'react';
import NotFound from '@/components/NotFound';

export default function Display2() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.authenticated === true))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return null;
  if (!isAdmin) return <NotFound />;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="/progress"
        style={{ flex: 1, border: 'none', height: '100%' }}
      />
      <div style={{ width: '1px', background: '#FFD700', flexShrink: 0 }} />
      <iframe
        src="/leaderboard"
        style={{ flex: 1, border: 'none', height: '100%' }}
      />
    </div>
  );
}
