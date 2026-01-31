# Gala 2026: Empowering Nepal's Future

A Next.js 15 charity gala fundraiser website for Teach For Nepal-style nonprofit event. Features elegant design, interactive seating chart, live auction, and admin portal.

## 🎨 Features

- **Elegant Design**: Gold/black/ivory color scheme with glassmorphism effects
- **Homepage**: Hero video background, event highlights, stats counter, RSVP CTA
- **Interactive Seating Chart**: 12-table circular layout with hover popovers
- **Live Auction**: Real-time bidding with timers and leaderboard
- **Admin Portal**: Manage seating, auction items, and sync with Google Sheets
- **Responsive**: Mobile-optimized design

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Prisma + Neon PostgreSQL
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Data Fetching**: SWR

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Initialize database
npx prisma generate
npx prisma db push
npx tsx scripts/init-seats.ts

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
tfn-sog-gala/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── seating/           # Seating chart page
│   ├── auction/            # Live auction page
│   └── admin/              # Admin portal
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   └── admin/             # Admin-specific components
├── lib/                    # Utilities and helpers
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # Authentication helpers
│   └── google-sheets.ts   # Google Sheets integration
├── prisma/                 # Database schema
│   └── schema.prisma
└── public/                 # Static assets
    └── images/            # Images folder
```

## 🔐 Admin Access

Access admin portal at `/admin/login`

## 📊 Database Schema

- **Seat**: Seating assignments (table, seat, guest info)
- **AuctionItem**: Auction items with bids
- **Bid**: Bid history
- **Admin**: Admin users (simple auth)

## 🔗 Google Sheets Integration

Sync seating data from Google Sheets:

1. Set up Google Service Account (see DEPLOYMENT.md)
2. Add `GOOGLE_SHEETS_ID` and `GOOGLE_SERVICE_ACCOUNT_KEY` to `.env.local`
3. Share your sheet with service account email
4. Use "Sheets Sync" tab in admin dashboard

## 📝 Environment Variables

See `.env.example` for all required variables.

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🎯 Key Pages

- `/` - Homepage with hero, highlights, stats
- `/seating` - Interactive seating chart
- `/auction` - Live auction with real-time updates
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin portal

## 🎨 Design System

- **Colors**: 
  - Primary: `#1a1a1a` (deep black)
  - Accent: `#D4AF37` (gold)
  - Glass: `rgba(255,255,255,0.1)`
- **Typography**: 
  - Headings: Playfair Display
  - Body: Inter
- **Effects**: Glassmorphism, parallax, smooth animations

## 📸 Adding Images & Media

Place images in `/public/images/`:
- `/images/people/` - Guest photos
- `/images/auction/` - Auction item images
- `/images/highlights/` - Event highlight photos

**Hero Video**: Add a video file at `/public/videos/gala-hero.mp4` for the homepage hero background. If the video doesn't exist, a gradient background will be shown instead.

## 🔑 Generate Admin Password Hash

```bash
npx tsx scripts/hash-password.ts "your-secure-password"
```

Copy the output hash to `ADMIN_PASSWORD_HASH` in your `.env.local`.

## 🤝 Contributing

This is a private project for the Gala 2026 event.

## 📄 License

Private - All rights reserved

---

Built with ❤️ for Teach For Nepal
