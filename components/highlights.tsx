"use client";

import React from 'react';

const EventHighlights = () => {
  const highlights = [
    { id: 1, img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=800&fit=crop', title: 'Gala Night 2025' },
    { id: 2, img: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=600&h=400&fit=crop', title: 'Award Ceremony' },
    { id: 3, img: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=800&fit=crop', title: 'Cultural Performance' },
    { id: 4, img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&h=400&fit=crop', title: 'Community Impact' },
    { id: 5, img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop', title: 'Live Auction' },
    { id: 6, img: 'https://images.unsplash.com/photo-1522543558187-768b6df7c25c?w=600&h=800&fit=crop', title: 'Networking' }
  ];

  return (
    <section id="highlights" className="py-24 w-full bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      <div className="w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Event Highlights</h2>
          <p className="text-xl text-gray-400">Moments that made a difference</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4 sm:px-6 lg:px-8">
          {highlights.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105"
              style={{ gridRow: item.id % 3 === 0 ? 'span 2' : 'span 1' }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventHighlights;
