import React from "react";
import Image from "next/image";

interface ImageZoomModalProps {
  open: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ open, imageUrl, title, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70" style={{ zIndex: 2001 }} onClick={onClose}>
      <div
        className="relative bg-white rounded-lg shadow-lg p-2 w-full max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center w-full h-full" style={{ aspectRatio: '4/3', width: '100%', maxWidth: '90vw', maxHeight: '80vh' }}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="rounded-lg object-contain"
            style={{ objectFit: 'contain' }}
            sizes="90vw"
            priority
          />
          <button
            className="absolute top-2 right-2 text-gray-700 hover:text-red-500 font-bold z-20"
            style={{ fontSize: "2.5rem", lineHeight: 1, padding: 0, background: 'none', border: 'none' }}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;
