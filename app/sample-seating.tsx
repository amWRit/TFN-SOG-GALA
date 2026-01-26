// import React, { useState } from 'react';
// import { Award, Users, X } from 'lucide-react';

// // Sample data structure (replace with Google Sheets data)
// const seatingData = {
//   tables: [
//     {
//       id: 1,
//       name: "Table 1 - Founders",
//       seats: [
//         { 
//           id: 1, 
//           name: "Sarah Johnson", 
//           quote: "Education is the most powerful weapon which you can use to change the world",
//           bio: "Founder and CEO of Nepal Education Foundation. 15+ years experience in educational development.",
//           involvement: "Founding Member",
//           image: "/images/placeholder.png"
//         },
//         { 
//           id: 2, 
//           name: "Michael Chen", 
//           quote: "Every child deserves a chance to dream big",
//           bio: "Board Director and philanthropist. Passionate about youth empowerment.",
//           involvement: "Major Donor",
//           image: "/images/placeholder.png"
//         },
//         { id: 3, name: "Emily Rodriguez", quote: "Together we rise", bio: "Community organizer and advocate.", involvement: "Volunteer", image: "/images/placeholder.png" },
//         { id: 4, name: "David Kumar", quote: "Impact through action", bio: "Social entrepreneur.", involvement: "Partner", image: "/images/placeholder.png" },
//         { id: 5, name: "Lisa Anderson", quote: "Building bridges", bio: "International development specialist.", involvement: "Advisor", image: "/images/placeholder.png" },
//         { id: 6, name: "James Park", quote: "Hope for tomorrow", bio: "Technology innovator.", involvement: "Sponsor", image: "/images/placeholder.png" },
//         { id: 7, name: "Maria Santos", quote: "Education first", bio: "Former teacher and mentor.", involvement: "Volunteer", image: "/images/placeholder.png" },
//         { id: 8, name: "Robert Lee", quote: "Creating opportunities", bio: "Business leader.", involvement: "Donor", image: "/images/placeholder.png" },
//       ]
//     },
//     {
//       id: 2,
//       name: "Table 2 - Supporters",
//       seats: Array.from({ length: 10 }, (_, i) => ({
//         id: i + 1,
//         name: `Guest ${i + 1}`,
//         quote: "Supporting Nepal's future",
//         bio: "Dedicated supporter of educational initiatives.",
//         involvement: "Supporter",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 3,
//       name: "Table 3 - Community",
//       seats: Array.from({ length: 8 }, (_, i) => ({
//         id: i + 1,
//         name: `Member ${i + 1}`,
//         quote: "Together we make a difference",
//         bio: "Active community member.",
//         involvement: "Member",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 4,
//       name: "Table 4 - Partners",
//       seats: Array.from({ length: 10 }, (_, i) => ({
//         id: i + 1,
//         name: `Partner ${i + 1}`,
//         quote: "Building partnerships for change",
//         bio: "Strategic partner organization.",
//         involvement: "Partner",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 5,
//       name: "Table 5 - Sponsors",
//       seats: Array.from({ length: 8 }, (_, i) => ({
//         id: i + 1,
//         name: `Sponsor ${i + 1}`,
//         quote: "Investing in education",
//         bio: "Corporate sponsor.",
//         involvement: "Sponsor",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 6,
//       name: "Table 6 - Volunteers",
//       seats: Array.from({ length: 10 }, (_, i) => ({
//         id: i + 1,
//         name: `Volunteer ${i + 1}`,
//         quote: "Service above self",
//         bio: "Dedicated volunteer.",
//         involvement: "Volunteer",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 7,
//       name: "Table 7 - Alumni",
//       seats: Array.from({ length: 8 }, (_, i) => ({
//         id: i + 1,
//         name: `Alumni ${i + 1}`,
//         quote: "Giving back",
//         bio: "Program alumni.",
//         involvement: "Alumni",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 8,
//       name: "Table 8 - Advisors",
//       seats: Array.from({ length: 10 }, (_, i) => ({
//         id: i + 1,
//         name: `Advisor ${i + 1}`,
//         quote: "Wisdom and guidance",
//         bio: "Advisory board member.",
//         involvement: "Advisor",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 9,
//       name: "Table 9 - Youth Leaders",
//       seats: Array.from({ length: 8 }, (_, i) => ({
//         id: i + 1,
//         name: `Leader ${i + 1}`,
//         quote: "The future is now",
//         bio: "Emerging youth leader.",
//         involvement: "Youth Leader",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 10,
//       name: "Table 10 - Educators",
//       seats: Array.from({ length: 10 }, (_, i) => ({
//         id: i + 1,
//         name: `Educator ${i + 1}`,
//         quote: "Teaching with purpose",
//         bio: "Dedicated educator.",
//         involvement: "Educator",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 11,
//       name: "Table 11 - Media",
//       seats: Array.from({ length: 8 }, (_, i) => ({
//         id: i + 1,
//         name: `Media ${i + 1}`,
//         quote: "Telling stories that matter",
//         bio: "Media representative.",
//         involvement: "Media",
//         image: "/images/placeholder.png"
//       }))
//     },
//     {
//       id: 12,
//       name: "Table 12 - VIP",
//       seats: Array.from({ length: 10 }, (_, i) => ({
//         id: i + 1,
//         name: `VIP Guest ${i + 1}`,
//         quote: "Honored to be here",
//         bio: "Special guest.",
//         involvement: "VIP",
//         image: "/images/placeholder.png"
//       }))
//     }
//   ]
// };

// const getBadgeColor = (involvement) => {
//   const colors = {
//     'Founding Member': 'from-purple-600 to-pink-600',
//     'Major Donor': 'from-amber-500 to-orange-600',
//     'Sponsor': 'from-blue-500 to-cyan-600',
//     'Partner': 'from-green-500 to-emerald-600',
//     'Advisor': 'from-indigo-500 to-purple-600',
//     'Volunteer': 'from-pink-500 to-rose-600',
//     'Alumni': 'from-teal-500 to-cyan-600',
//     'Youth Leader': 'from-yellow-500 to-amber-600',
//     'Educator': 'from-red-500 to-pink-600',
//     'Media': 'from-violet-500 to-purple-600',
//     'VIP': 'from-amber-600 to-yellow-500',
//     'default': 'from-gray-600 to-gray-700'
//   };
//   return colors[involvement] || colors.default;
// };

// const SeatCard = ({ seat, tableId, onClose }) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
//       <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-md w-full border border-purple-500/20 overflow-hidden">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
//         >
//           <X className="w-6 h-6" />
//         </button>

//         {/* Decorative gradient */}
//         <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />

//         {/* Content */}
//         <div className="relative p-8 pt-12">
//           {/* Profile Image */}
//           <div className="flex justify-center mb-6">
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-xl opacity-50" />
//               <img
//                 src={seat.image}
//                 alt={seat.name}
//                 className="relative w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-xl"
//               />
//             </div>
//           </div>

//           {/* Name */}
//           <h3 className="text-3xl font-bold text-white text-center mb-2">
//             {seat.name}
//           </h3>

//           {/* Badge */}
//           <div className="flex justify-center mb-6">
//             <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getBadgeColor(seat.involvement)}`}>
//               <Award className="w-4 h-4" />
//               {seat.involvement}
//             </span>
//           </div>

//           {/* Quote */}
//           <blockquote className="mb-6 text-center">
//             <p className="text-lg text-gray-300 italic" style={{ fontFamily: 'Playfair Display, serif' }}>
//               "{seat.quote}"
//             </p>
//           </blockquote>

//           {/* Bio */}
//           <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
//             <p className="text-gray-300 leading-relaxed">
//               {seat.bio}
//             </p>
//           </div>

//           {/* Seat Info */}
//           <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
//             <Users className="w-4 h-4" />
//             <span>Table {tableId} • Seat {seat.id}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Table = ({ table, onSeatClick }) => {
//   const seatCount = table.seats.length;
//   const radius = 120;
  
//   const getSeatPosition = (index) => {
//     const angle = (index * 360) / seatCount - 90;
//     const radian = (angle * Math.PI) / 180;
//     const x = radius * Math.cos(radian);
//     const y = radius * Math.sin(radian);
//     return { x, y };
//   };

//   return (
//     <div className="relative flex flex-col items-center">
//       {/* Table label */}
//       <div className="mb-4 text-center">
//         <h3 className="text-xl font-bold text-white mb-1">{table.name}</h3>
//         <p className="text-sm text-gray-400">{seatCount} Seats</p>
//       </div>

//       {/* Table visualization */}
//       <div className="relative" style={{ width: '320px', height: '320px' }}>
//         {/* Table center */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-purple-500/20 shadow-xl flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
//               {table.id}
//             </div>
//             <div className="text-xs text-gray-400 uppercase tracking-wider">Table</div>
//           </div>
//         </div>

//         {/* Seats */}
//         {table.seats.map((seat, index) => {
//           const { x, y } = getSeatPosition(index);
//           return (
//             <button
//               key={seat.id}
//               onClick={() => onSeatClick(seat, table.id)}
//               className="absolute top-1/2 left-1/2 group cursor-pointer"
//               style={{
//                 transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
//               }}
//             >
//               <div className="relative">
//                 {/* Glow effect */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                
//                 {/* Seat image */}
//                 <div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-white/20 group-hover:border-purple-400 transition-all duration-300 group-hover:scale-110 shadow-lg">
//                   <img
//                     src={seat.image}
//                     alt={seat.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* Seat number */}
//                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900 shadow-lg">
//                   {seat.id}
//                 </div>

//                 {/* Name tooltip on hover (desktop only) */}
//                 <div className="hidden md:block absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
//                   <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-purple-500/30">
//                     {seat.name}
//                   </div>
//                 </div>
//               </div>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const SeatingChart = () => {
//   const [selectedSeat, setSelectedSeat] = useState(null);
//   const [selectedTable, setSelectedTable] = useState(null);

//   const handleSeatClick = (seat, tableId) => {
//     setSelectedSeat(seat);
//     setSelectedTable(tableId);
//   };

//   const handleClose = () => {
//     setSelectedSeat(null);
//     setSelectedTable(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
//       {/* Header */}
//       <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
//             Seating Chart
//           </h1>
//           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//             Click on any seat to view guest information and their involvement with our mission
//           </p>
//         </div>
//       </div>

//       {/* Tables Grid */}
//       <div className="px-4 sm:px-6 lg:px-8 pb-24">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
//             {seatingData.tables.map((table) => (
//               <Table
//                 key={table.id}
//                 table={table}
//                 onSeatClick={handleSeatClick}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Seat Detail Modal */}
//       {selectedSeat && (
//         <SeatCard
//           seat={selectedSeat}
//           tableId={selectedTable}
//           onClose={handleClose}
//         />
//       )}

//       {/* Legend */}
//       <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md border border-purple-500/20 rounded-2xl px-6 py-4 shadow-2xl">
//         <div className="flex items-center gap-6 text-sm text-gray-300">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600" />
//             <span>Click to view details</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Users className="w-5 h-5 text-purple-400" />
//             <span>{seatingData.tables.reduce((acc, t) => acc + t.seats.length, 0)} Total Guests</span>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SeatingChart;