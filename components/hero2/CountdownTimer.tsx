import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string | number | Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(212,175,55,0.35)',
        borderRadius: '10px',
        width: '72px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFD700', fontFamily: 'inherit', letterSpacing: '-0.02em' }}>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      <Unit value={timeLeft.days} label="Days" />
      <Unit value={timeLeft.hours} label="Hours" />
      <Unit value={timeLeft.minutes} label="Mins" />
      <Unit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default CountdownTimer;
