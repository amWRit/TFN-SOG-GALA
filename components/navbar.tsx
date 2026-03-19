"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Award, Menu } from 'lucide-react';


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const logoRef = useRef<HTMLImageElement | null>(null);
  let longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret key sequence for desktop
  useEffect(() => {
    let buffer = '';
    const handler = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.endsWith('admin')) {
        setShowAdmin(true);
        buffer = '';
      }
      if (buffer.length > 10) buffer = buffer.slice(-10);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Long-press for mobile
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;
    const handleTouchStart = () => {
      longPressTimer.current = setTimeout(() => setShowAdmin(true), 1200);
    };
    const handleTouchEnd = () => {
      if (longPressTimer.current !== null) {
        clearTimeout(longPressTimer.current);
      }
    };
    logo.addEventListener('touchstart', handleTouchStart);
    logo.addEventListener('touchend', handleTouchEnd);
    return () => {
      logo.removeEventListener('touchstart', handleTouchStart);
      logo.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <img ref={logoRef} src="/images/logos/logomini.png" alt="Teach For Nepal Logo" className="w-10 h-10 object-contain mr-2" />
            <span className="text-2xl font-bold text-[#084691] hidden sm:inline">Teach For Nepal</span>
          </div>
          {/* Desktop Links */}
          <div className="hidden md:flex space-x-10">
              {[
                { href: '#home', label: 'Home' },
                { href: '#highlights', label: 'Highlights' },
                { href: '/program', label: 'Program' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[#225898] hover:text-[#d71a21] font-semibold tracking-wide px-2 py-1 transition-colors duration-200 focus:outline-none"
                  tabIndex={0}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-gold to-gold-dark scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 transition-transform duration-300 origin-left" aria-hidden="true"></span>
                </a>
              ))}
          </div>
          {/* Admin & RSVP Buttons */}
            <div className="flex items-center space-x-2 ml-4 hidden md:flex">
              {showAdmin && (
                <a
                  href="/admin/dashboard"
                  className="bg-gradient-to-r from-gold to-gold-dark text-[#23272F] px-6 py-2.5 rounded-full font-semibold border border-[#D4AF37] hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  aria-label="Admin Dashboard"
                >
                  Admin
                </a>
              )}
              <a
                href="/register"
                  className="bg-[#d71a21] hover:bg-[#b81519] text-white px-9 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                aria-label="RSVP Now"
              >
                RSVP Now
              </a>
            </div>
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden ml-4 focus:outline-none"
            aria-label="Open Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={28} color="#225898" />
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center bg-white border-t border-gray-100 py-4 rounded-b-xl shadow-xl animate-fade-in">
            <a href="#home" className="text-[#225898] py-2 w-full text-center hover:text-[#d71a21] font-medium transition" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#highlights" className="text-[#225898] py-2 w-full text-center hover:text-[#d71a21] font-medium transition" onClick={() => setMenuOpen(false)}>Highlights</a>
            <a href="/program" className="text-[#225898] py-2 w-full text-center hover:text-[#d71a21] font-medium transition" onClick={() => setMenuOpen(false)}>Program</a>
            <a
              href="/register"
              className="bg-[#d71a21] hover:bg-[#b81519] text-white px-6 py-2.5 rounded-full font-semibold mt-3 w-full hover:shadow-lg transition-all duration-300 text-center"
              aria-label="RSVP Now"
              onClick={() => setMenuOpen(false)}
            >
              RSVP Now
            </a>
            {showAdmin && (
              <a
                href="/admin/dashboard"
                className="bg-gradient-to-r from-gold to-gold-dark text-[#23272F] px-6 py-2.5 rounded-full font-semibold border border-[#D4AF37] mt-3 w-full hover:shadow-2xl transition-all duration-300 text-center"
                aria-label="Admin Dashboard"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
