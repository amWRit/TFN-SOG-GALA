"use client";

import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <img src="/images/logos/logomini.png" alt="Teach For Nepal Logo" className="w-10 h-10 object-contain mr-2" />
            <span className="text-2xl font-bold text-white hidden sm:inline">Teach For Nepal</span>
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
                  className="relative text-white font-semibold tracking-wide px-2 py-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  tabIndex={0}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-gold to-gold-dark scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 transition-transform duration-300 origin-left" aria-hidden="true"></span>
                </a>
              ))}
          </div>
          {/* Admin & RSVP Buttons */}
            <div className="flex items-center space-x-2 ml-4 hidden md:flex">
              <a
                href="/admin/dashboard"
                className="bg-gradient-to-r from-gold to-gold-dark text-[#23272F] px-6 py-2.5 rounded-full font-semibold border border-[#D4AF37] hover:shadow-2xl hover:scale-105 transition-all duration-300"
                aria-label="Admin Dashboard"
              >
                Admin
              </a>
              <a
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-9 py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                aria-label="RSVP Now"
              >
                RSVP Now
              </a>
            </div>
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden ml-4 text-white focus:outline-none"
            aria-label="Open Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center bg-gray-900/95 backdrop-blur-md py-4 rounded-b-xl shadow-xl animate-fade-in">
            <a href="#home" className="text-white py-2 w-full text-center hover:bg-purple-700 transition" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#highlights" className="text-white py-2 w-full text-center hover:bg-purple-700 transition" onClick={() => setMenuOpen(false)}>Highlights</a>
            <a href="/program" className="text-white py-2 w-full text-center hover:bg-purple-700 transition" onClick={() => setMenuOpen(false)}>Program</a>
            <a
              href="/admin/dashboard"
              className="bg-gradient-to-r from-gold to-gold-dark text-[#23272F] px-6 py-2.5 rounded-full font-semibold border border-[#D4AF37] mt-3 w-full hover:shadow-2xl transition-all duration-300 text-center"
              aria-label="Admin Dashboard"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </a>
            <a
              href="/register"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-semibold mt-3 w-full hover:shadow-2xl transition-all duration-300 text-center"
              aria-label="RSVP Now"
              onClick={() => setMenuOpen(false)}
            >
              RSVP Now
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
