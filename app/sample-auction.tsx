import React, { useState, useEffect } from 'react';
import { Gavel, TrendingUp, Clock, ChevronDown, ChevronUp, Trophy, Medal, Award, Zap } from 'lucide-react';

// Sample auction data (replace with API/database)
const initialAuctionItems = [
  {
    id: 1,
    title: "Exclusive Himalayan Trek Package",
    description: "7-day guided trek to Everest Base Camp with accommodation and meals included",
    image: "/images/placeholder.png",
    currentBid: 2500,
    minBidIncrement: 100,
    timeLeft: 7200, // seconds
    bidHistory: [
      { bidder: "John D.", amount: 2500, time: "2 min ago", avatar: "/images/placeholder.png" },
      { bidder: "Sarah M.", amount: 2300, time: "5 min ago", avatar: "/images/placeholder.png" },
      { bidder: "Mike K.", amount: 2000, time: "8 min ago", avatar: "/images/placeholder.png" }
    ]
  },
  {
    id: 2,
    title: "Traditional Nepali Art Collection",
    description: "Hand-painted thangka artwork by renowned local artists",
    image: "/images/placeholder.png",
    currentBid: 1800,
    minBidIncrement: 50,
    timeLeft: 5400,
    bidHistory: [
      { bidder: "Emily R.", amount: 1800, time: "1 min ago", avatar: "/images/placeholder.png" },
      { bidder: "David L.", amount: 1700, time: "4 min ago", avatar: "/images/placeholder.png" }
    ]
  },
  {
    id: 3,
    title: "Luxury Dinner for 10",
    description: "Private chef experience at a 5-star restaurant in Kathmandu",
    image: "/images/placeholder.png",
    currentBid: 3200,
    minBidIncrement: 150,
    timeLeft: 3600,
    bidHistory: [
      { bidder: "Robert P.", amount: 3200, time: "30 sec ago", avatar: "/images/placeholder.png" },
      { bidder: "Lisa A.", amount: 3000, time: "3 min ago", avatar: "/images/placeholder.png" },
      { bidder: "James W.", amount: 2800, time: "6 min ago", avatar: "/images/placeholder.png" }
    ]
  },
  {
    id: 4,
    title: "Vintage Photography Collection",
    description: "Rare black and white photographs of Nepal from the 1960s",
    image: "/images/placeholder.png",
    currentBid: 1500,
    minBidIncrement: 75,
    timeLeft: 9000,
    bidHistory: [
      { bidder: "Anna B.", amount: 1500, time: "4 min ago", avatar: "/images/placeholder.png" }
    ]
  },
  {
    id: 5,
    title: "Wellness Retreat Package",
    description: "3-day yoga and meditation retreat in Pokhara",
    image: "/images/placeholder.png",
    currentBid: 1200,
    minBidIncrement: 50,
    timeLeft: 4500,
    bidHistory: [
      { bidder: "Maria S.", amount: 1200, time: "2 min ago", avatar: "/images/placeholder.png" },
      { bidder: "Tom H.", amount: 1100, time: "7 min ago", avatar: "/images/placeholder.png" }
    ]
  },
  {
    id: 6,
    title: "Handwoven Pashmina Set",
    description: "Luxury cashmere shawls and scarves made by local artisans",
    image: "/images/placeholder.png",
    currentBid: 800,
    minBidIncrement: 25,
    timeLeft: 6300,
    bidHistory: [
      { bidder: "Karen T.", amount: 800, time: "1 min ago", avatar: "/images/placeholder.png" }
    ]
  },
  {
    id: 7,
    title: "Mountain Bike Adventure",
    description: "Full-day mountain biking tour with professional guide",
    image: "/images/placeholder.png",
    currentBid: 650,
    minBidIncrement: 25,
    timeLeft: 8100,
    bidHistory: [
      { bidder: "Chris P.", amount: 650, time: "5 min ago", avatar: "/images/placeholder.png" }
    ]
  },
  {
    id: 8,
    title: "Cooking Class with Master Chef",
    description: "Learn to cook authentic Nepali cuisine in a 4-hour hands-on class",
    image: "/images/placeholder.png",
    currentBid: 450,
    minBidIncrement: 25,
    timeLeft: 5700,
    bidHistory: [
      { bidder: "Nina L.", amount: 450, time: "3 min ago", avatar: "/images/placeholder.png" }
    ]
  }
];

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

interface AuctionHeroProps {
  totalBids: number;
  highestBid: number;
}

const AuctionHero = ({ totalBids, highestBid }: AuctionHeroProps) => {
  return (
    <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-6">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-semibold">Live Now</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Live <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Auction</span>
        </h1>
        
        <p className="text-2xl text-gray-300 mb-8">
          Bidding Now Open!
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-6 min-w-[200px]">
            <div className="text-4xl font-bold text-white mb-2">
              ${highestBid.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300 uppercase tracking-wider">Highest Bid</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-6 min-w-[200px]">
            <div className="text-4xl font-bold text-white mb-2">
              {totalBids}
            </div>
            <div className="text-sm text-gray-300 uppercase tracking-wider">Total Bids</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Bid {
  bidder: string;
  amount: number;
  time: string;
  avatar: string;
}

interface AuctionItemProps {
  item: {
    id: number;
    title: string;
    description: string;
    image: string;
    currentBid: number;
    minBidIncrement: number;
    timeLeft: number;
    bidHistory: Bid[];
  };
  onBid: (itemId: number) => void;
}

const AuctionItem = ({ item, onBid }: AuctionItemProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [timeLeft, setTimeLeft] = useState(item.timeLeft);
  const [currentBid, setCurrentBid] = useState(item.currentBid);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        const newTime = prev - 1;
        setIsUrgent(newTime <= 300); // Last 5 minutes
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate live bid updates (replace with real-time data)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% chance of bid update
        setCurrentBid(prev => prev + item.minBidIncrement);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [item.minBidIncrement]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* Image */}
      <div className="relative h-64 overflow-hidden group">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
        
        {/* Time left badge */}
        <div className={`absolute top-4 right-4 ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-purple-600'} text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>

        {/* Current Bid */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Current Bid</div>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                ${currentBid.toLocaleString()}
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <button
              onClick={() => onBid(item.id)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Gavel className="w-5 h-5" />
              Bid Now
            </button>
          </div>
        </div>

        {/* Bid History Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-sm font-semibold">Bid History ({item.bidHistory.length})</span>
          {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {/* Bid History List */}
        {showHistory && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {item.bidHistory.map((bid, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
              >
                <img 
                  src={bid.avatar} 
                  alt={bid.bidder}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-white font-semibold">{bid.bidder}</div>
                  <div className="text-gray-400 text-sm">{bid.time}</div>
                </div>
                <div className="text-white font-bold">${bid.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface LeaderboardProps {
  items: {
    id: number;
    title: string;
    description: string;
    image: string;
    currentBid: number;
    minBidIncrement: number;
    timeLeft: number;
    bidHistory: Bid[];
  }[];
}

const Leaderboard = ({ items }: LeaderboardProps) => {
  // Calculate top bidders from all items
  const allBidders = items.flatMap(item => 
    item.bidHistory.map(bid => ({ ...bid, itemTitle: item.title }))
  );

  type BidderTotal = { name: string; total: number; bids: number; avatar: string };
  const bidderTotals = allBidders.reduce<Record<string, BidderTotal>>((acc, bid) => {
    const name = bid.bidder;
    if (!acc[name]) {
      acc[name] = { name, total: 0, bids: 0, avatar: bid.avatar };
    }
    acc[name].total += bid.amount;
    acc[name].bids += 1;
    return acc;
  }, {});

  const topBidders = Object.values(bidderTotals)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const medals = [
    { icon: Trophy, color: 'from-yellow-400 to-yellow-600', size: 'w-8 h-8' },
    { icon: Medal, color: 'from-gray-400 to-gray-600', size: 'w-7 h-7' },
    { icon: Award, color: 'from-amber-600 to-amber-800', size: 'w-6 h-6' }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-purple-500/20">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-400" />
        Top Bidders
      </h2>

      <div className="space-y-4">
        {topBidders.map((bidder, index) => {
          const Medal = medals[index];
          return (
            <div 
              key={index}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-all"
            >
              <div className="relative">
                <img 
                  src={bidder.avatar} 
                  alt={bidder.name}
                  className="w-16 h-16 rounded-full border-4 border-purple-500/30"
                />
                <div className={`absolute -bottom-2 -right-2 bg-gradient-to-br ${Medal.color} rounded-full p-2 border-2 border-gray-900`}>
                  <Medal.icon className={`${Medal.size} text-white`} />
                </div>
              </div>

              <div className="flex-1">
                <div className="text-xl font-bold text-white">{bidder.name}</div>
                <div className="text-gray-400 text-sm">{bidder.bids} bids placed</div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  ${bidder.total.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">Total</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LiveAuction = () => {
  const [auctionItems, setAuctionItems] = useState(initialAuctionItems);

  // Simulate real-time updates (replace with actual API polling or WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      // Poll for updates every 3 seconds
      // In production, replace with: fetch('/api/auction-items')
      console.log('Polling for auction updates...');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleBid = (itemId: number) => {
    alert(`Bid placed for item ${itemId}! In production, this would open a bid modal.`);
    // In production: open modal, validate bid, submit to API
  };

  const totalBids = auctionItems.reduce((acc, item) => acc + item.bidHistory.length, 0);
  const highestBid = Math.max(...auctionItems.map(item => item.currentBid));

  return (
    <div className="min-h-screen bg-gray-900">
      <AuctionHero totalBids={totalBids} highestBid={highestBid} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6">Active Auctions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {auctionItems.map(item => (
                <AuctionItem 
                  key={item.id} 
                  item={item}
                  onBid={handleBid}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Leaderboard items={auctionItems} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveAuction;