import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Award, ChevronRight, Play } from 'lucide-react';

// Brand colors (matching your brand-colors.ts)
const colors = {
  primary: '#8B5CF6',
  secondary: '#EC4899',
  accent: '#F59E0B',
  dark: '#1F2937',
  light: '#F9FAFB'
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <Award className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-white">SOG Gala</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition">Home</a>
            <a href="#highlights" className="text-gray-300 hover:text-white transition">Highlights</a>
            <a href="#auction" className="text-gray-300 hover:text-white transition">Auction</a>
            <a href="#impact" className="text-gray-300 hover:text-white transition">Impact</a>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
            RSVP Now
          </button>
        </div>
      </div>
    </nav>
  );
};

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-20 h-20 flex items-center justify-center mb-2">
        <span className="text-3xl font-bold text-white">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-sm text-gray-300 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-4 justify-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

const VideoHero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-gray-900/80 to-pink-900/90 z-10" />
      
      {/* Background image (placeholder for video thumbnail) */}
      <div className="absolute inset-0 bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop" 
          alt="Gala Event"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            Gala <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">2026</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-200 font-light">
            Empowering Nepal's Future
          </p>

          <div className="py-8">
            <CountdownTimer targetDate="2026-12-31T18:00:00" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setShowVideo(true)}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Watch 2025 Highlights
            </button>
            
            <a 
              href="https://forms.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              Live Auction Tonight
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-6xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl"
            >
              ✕ Close
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/u1OCCza-Nl0?autoplay=1"
              title="Gala 2025 Highlights"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

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
    <section id="highlights" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Event Highlights</h2>
          <p className="text-xl text-gray-400">Moments that made a difference</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    { icon: DollarSign, value: 50, suffix: 'K', label: 'Raised' },
    { icon: Calendar, value: 10, suffix: '', label: 'Years Impact' }
  ];

  return (
    <section id="stats" className="py-24 bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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

const CTASection = () => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">
          Join Us in Making History
        </h2>
        <p className="text-xl text-gray-400 mb-10">
          Be part of an unforgettable evening supporting Nepal's future leaders
        </p>
        <a
          href="https://forms.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Reserve Your Spot
          <ChevronRight className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};

const GalaHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <VideoHero />
      <StatsSection />
      <EventHighlights />
      <CTASection />
    </div>
  );
};

export default GalaHomepage;