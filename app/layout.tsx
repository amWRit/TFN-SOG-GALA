import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gala 2026: Empowering Nepal's Future | Teach For Nepal",
  description: "Join us for an elegant evening supporting education in Nepal. Live auction, interactive seating, and unforgettable moments.",
  icons: {
    icon: [
      { url: "/images/logos/favicon.ico" },
      { url: "/images/logos/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logos/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: [
      { url: "/images/logos/favicon.ico" },
    ],
    apple: [
      { url: "/images/logos/favicon-32x32.png", sizes: "32x32" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="en" className="scroll-smooth">
        <head>
          <link rel="icon" href="/images/logos/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" href="/images/logos/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/images/logos/favicon-16x16.png" sizes="16x16" />
          <link rel="apple-touch-icon" href="/images/logos/favicon-32x32.png" />
          {/* Defensive script to prevent window.ethereum errors */}
          <script dangerouslySetInnerHTML={{__html: `
            try {
              if (typeof window !== 'undefined' && window.ethereum === undefined) {
                window.ethereum = null;
              }
            } catch (e) {}
          `}} />
          {/* Open Graph & Twitter meta tags for social sharing */}
          <meta property="og:title" content="Gala 2026: Empowering Nepal's Future | Teach For Nepal" />
          <meta property="og:description" content="Join us for an elegant evening supporting education in Nepal. Live auction, interactive seating, and unforgettable moments." />
          <meta property="og:image" content="/images/logos/tfnlogo.png" />
          <meta property="og:url" content="https://tfngala.vercel.app/" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Gala 2026: Empowering Nepal's Future | Teach For Nepal" />
          <meta name="twitter:description" content="Join us for an elegant evening supporting education in Nepal. Live auction, interactive seating, and unforgettable moments." />
          <meta name="twitter:image" content="/images/logos/tfnlogo.png" />
          <meta name="twitter:url" content="https://tfngala.vercel.app/" />
        </head>
        <body
          className={`${inter.variable} ${playfair.variable} antialiased bg-[#1a1a1a] text-[#f5f5f5]`}
        >
          {/* Show warning for unsupported devices if wallet code is ever used */}
          <noscript>
            <div style={{background:'#d13239',color:'#fff',padding:'12px',textAlign:'center',fontWeight:600}}>Wallet features are not supported on this device/browser.</div>
          </noscript>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(26, 26, 26, 0.95)",
                color: "#f5f5f5",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              },
            }}
          />
        </body>
      </html>
    );
}
