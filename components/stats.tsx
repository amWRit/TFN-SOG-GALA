"use client";

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, Coins, Gavel } from 'lucide-react';

const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const [attendees, setAttendees] = useState<number | null>(null);
  const [auctionItems, setAuctionItems] = useState<number | null>(null);
  const [raised, setRaised] = useState<number | null>(null);

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

  useEffect(() => {
    // Fetch attendee count from API
    fetch('/api/admin/registration?countOnly=true')
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') setAttendees(data.count);
      });
    // Fetch auction items count from API
    fetch('/api/admin/auction/items?countOnly=true')
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') setAuctionItems(data.count);
      });
    // Fetch raised amount from API
    fetch('/api/admin/registration?sumPayment=true')
      .then(res => res.json())
      .then(data => {
        if (typeof data.sum === 'number') setRaised(data.sum);
      });
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

  const formatK = (num: number) => {
    if (num < 1000) return num;
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  };

  const stats = [
    { icon: Calendar, value: 14, suffix: '', label: 'Years Impact' },
    { icon: Users, value: attendees ?? 0, suffix: '+', label: 'Attendees' },
    { icon: Coins, value: raised ?? 0, suffix: '', label: 'Raised', format: formatK },
    { icon: Gavel, value: auctionItems ?? 0, suffix: '', label: 'Auction Items' }
  ];

  return (
    <section id="stats" className="py-24 bg-[#f4f7fc] w-full border-t border-b border-[#225898]/10">
      <div className="w-full flex flex-col items-center justify-center px-6 sm:px-10 md:px-16 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#225898]/10 border border-[#225898]/20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-10 h-10 text-[#d71a21]" />
              </div>
              <div className="text-6xl font-bold text-[#084691] mb-2">
                {stat.format ? stat.format(stat.value) : <AnimatedNumber end={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-xl text-[#225898]/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
