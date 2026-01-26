/**
 * Sample data for development and testing
 */

export const sampleSeats = [
  {
    tableNumber: 1,
    seatNumber: 1,
    name: "Priya Sharma",
    quote: "Education changes everything",
    bio: "Fellow 2022",
    involvement: "Fellow 2022",
    imageUrl: "/images/people/priya.jpg",
  },
  {
    tableNumber: 1,
    seatNumber: 2,
    name: "Rajesh Kumar",
    quote: "Every child deserves quality education",
    bio: "Board Member",
    involvement: "Board Member",
    imageUrl: "/images/people/rajesh.jpg",
  },
  // Add more sample data as needed
];

export const sampleAuctionItems = [
  {
    title: "Dinner with CEO",
    description: "An exclusive dinner experience with our CEO",
    imageUrl: "/images/auction/dinner.jpg",
    startingBid: 2500,
    endTime: new Date("2026-03-15T22:00:00"),
    isActive: true,
  },
  {
    title: "Nepal Trekking Experience",
    description: "7-day guided trek through the Himalayas",
    imageUrl: "/images/auction/trek.jpg",
    startingBid: 5000,
    endTime: new Date("2026-03-15T22:30:00"),
    isActive: true,
  },
  {
    title: "Original Artwork",
    description: "Beautiful painting by local artist",
    imageUrl: "/images/auction/art.jpg",
    startingBid: 1000,
    endTime: new Date("2026-03-15T21:00:00"),
    isActive: true,
  },
];
