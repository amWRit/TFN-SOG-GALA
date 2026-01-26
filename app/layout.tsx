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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#1a1a1a] text-[#f5f5f5]`}
      >
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
