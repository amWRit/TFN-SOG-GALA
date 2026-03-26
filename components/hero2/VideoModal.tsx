import React from 'react';

interface VideoModalProps {
  show: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div
      onClick={onClose}
      className="fadeUp4"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '16/9' }} onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '-44px', right: 0, background: 'none', border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", opacity: 0.7 }}
        >
          ✕ Close
        </button>
        <iframe
          width="100%" height="100%"
          src="https://www.youtube.com/embed/u1OCCza-Nl0?autoplay=1"
          title="Gala 2025 Highlights"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: '12px' }}
        />
      </div>
    </div>
  );
};

export default VideoModal;
