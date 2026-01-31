import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/register.module.css';
import { PAYMENT_LINKS } from '../constants';
import { ZoomIn } from 'lucide-react';

export default function PaymentInfo() {
  const [zoomed, setZoomed] = useState<null | { img: string; alt: string; label: string }>(null);
  const [paymentQrs, setPaymentQrs] = useState<any[]>([]);
  const [noImage, setNoImage] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/images')
      .then(res => res.json())
      .then(data => {
        const allowedLabels = ['Fonepay', 'eSewa', 'PayPal', 'Zeffy'];
        const qrs = (data.images || []).filter((img: any) =>
          (img.type === 'payment_qr' || allowedLabels.includes(img.label))
        ).map((img: any) => ({
          label: img.label.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          img: `https://drive.google.com/uc?export=view&id=${img.fileId}`,
          alt: img.alt || img.label
        }));
        setPaymentQrs(qrs);
        // Find No_Image fallback
        const noImg = (data.images || []).find((img: any) => img.label.toLowerCase() === 'no_image');
        setNoImage(noImg ? `https://drive.google.com/uc?export=view&id=${noImg.fileId}` : null);
      });
  }, []);

  return (
    <div
      className={styles['payment-info-card']}
      style={{ maxWidth: '100vw', height: 608, display: 'flex', flexDirection: 'column' }}
    >
      <div>
        <h2
          className={styles.gradientText + " mb-[18px] md:mb-10"}
          style={{ fontSize: '2.2rem', lineHeight: 1.2, textAlign: 'center' }}
        >
          Support Teach For Nepal
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 24, maxWidth: '100%' }}>
          {paymentQrs.map(qr => (
            <div key={qr.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140 }}>
              <div style={{ position: 'relative', background: '#fff', borderRadius: 16, padding: 10, marginBottom: 8, boxShadow: '0 2px 8px #0002', cursor: 'pointer' }}
                onClick={() => setZoomed(qr)}
              >
                <Image
                  src={qr.img}
                  alt={qr.alt}
                  width={120}
                  height={120}
                  style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 14 }}
                  onError={(e: any) => {
                    if (noImage && e.currentTarget.src !== noImage) {
                      e.currentTarget.src = noImage;
                    }
                  }}
                />
                <span style={{ position: 'absolute', right: 8, bottom: 8, background: 'rgba(255,255,255,0.85)', borderRadius: '50%', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ZoomIn size={28} color="#9333ea" strokeWidth={2.2} style={{ background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px #0002' }} />
                </span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 500, color: '#F472B6', textAlign: 'center' }}>{qr.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div>
        <div
          className={styles.gradientText + " mb-4"}
          style={{ fontSize: '1.8rem', lineHeight: 1.2, textAlign: 'center', fontWeight: 600 }}
        >
          Other Ways to Give
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          {PAYMENT_LINKS.map((link: { label: string; url: string; instructions?: string }) => (
            <div key={link.label} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.primaryButton + ' w-full mt-1'} style={{ textAlign: 'center', fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
                {link.label}
              </a>
              {link.instructions && (
                <span style={{ fontSize: 13, color: '#fbbf24', marginTop: 2, textAlign: 'center', maxWidth: 320 }}>
                  {link.instructions}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Modal for zoomed QR */}
      {zoomed && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setZoomed(null)}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 4px 32px #0008', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
            <Image src={zoomed.img} alt={zoomed.alt} width={320} height={320} style={{ maxWidth: '320', height: 'auto', objectFit: 'contain', borderRadius: 12, marginBottom: 12, display: 'block' }} />
            <div style={{ fontWeight: 600, color: '#9333ea', fontSize: 18, marginBottom: 8 }}>{zoomed.label}</div>
            <button onClick={() => setZoomed(null)} style={{ marginTop: 8, background: '#9333ea', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
