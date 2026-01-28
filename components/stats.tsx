"use client";

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, Coins } from 'lucide-react';

const StatsSection = () => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const AnimatedNumber = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!inView) return;
      
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [inView, end]);

    return <span>{count}{suffix}</span>;
  };

  const stats = [
    { icon: Users, value: 150, suffix: '+', label: 'Attendees' },
    { icon: Coins, value: 50, suffix: 'K', label: 'Raised' },
    { icon: Calendar, value: 10, suffix: '', label: 'Years Impact' }
  ];

  return (
    <section id="stats" className="py-24 bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 w-full">
      <div className="w-full flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-10 h-10 text-purple-400" />
              </div>
              <div className="text-6xl font-bold text-white mb-2">
                <AnimatedNumber end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xl text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
