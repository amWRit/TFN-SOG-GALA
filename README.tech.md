# Gala 2026 Technical Overview

This document provides a technical summary for developers and maintainers of the Gala 2026 website.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** Prisma ORM + Neon PostgreSQL
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Data Fetching:** SWR
- **Authentication:** Session-based, bcrypt password hashing
- **Google Sheets Integration:** Service account API for seating sync

## 📁 Project Structure

```
TFN-SOG-GALA-Git/
├── app/                         # Next.js App Router pages & API
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                 # Homepage
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── seating/
│   │       └── page.tsx
│   ├── auction/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── program/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── seating/
│   │   └── page.tsx
│   └── api/                     # API routes (RESTful)
│       ├── admin/
│       │   ├── accounts/
│       │   │   ├── route.ts
│       │   │   └── [id]/route.ts
│       │   ├── auction/
│       │   │   ├── bid/route.ts
│       │   │   └── items/
│       │   │       ├── route.ts
│       │   │       └── [id]/bids/route.ts
│       │   ├── images/
│       │   │   ├── route.ts
│       │   │   └── [id]/route.ts
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── registration/
│       │   │   ├── route.ts
│       │   │   └── [id]/route.ts
│       │   ├── seating/
│       │   │   ├── route.ts
│       │   │   └── [id]/route.ts
│       │   ├── session/route.ts
│       │   └── sheets/
│       │       ├── export-registration/route.ts
│       │       ├── export-seating/route.ts
│       │       └── sync/route.ts
│       ├── auction/
│       │   ├── items/
│       │   │   ├── route.ts
│       │   │   ├── bid/route.ts
│       │   │   └── [id]/route.ts
│       │   └── leaderboard/route.ts
│       ├── program/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── register/route.ts
│       ├── seating/
│       │   ├── route.ts
│       │   └── available/route.ts
│       └── total-raised/route.ts
├── components/                  # React components
│   ├── admin-dashboard.tsx      # Main admin dashboard
│   ├── auction-grid.tsx
│   ├── auction-item-card.tsx
│   ├── auction-leaderboard.tsx
│   ├── countdown-timer.tsx
│   ├── cta.tsx
│   ├── hero.tsx
│   ├── highlights.tsx
│   ├── navbar.tsx
│   ├── program-card.tsx
│   ├── program-modal.tsx
│   ├── seating-chart.tsx
│   ├── stats.tsx
│   ├── video-background.tsx
│   ├── constants.ts
│   ├── admin/
│   │   ├── admin-accounts.tsx
│   │   ├── auction-add-bid-modal.tsx
│   │   ├── auction-admin.tsx
│   │   ├── auction-bid-history-modal.tsx
│   │   ├── auction-item-admin-card.tsx
│   │   ├── confirm-modal.tsx
│   │   ├── event-admin.tsx
│   │   ├── images-admin.tsx
│   │   ├── index.ts
│   │   ├── ok-modal.tsx
│   │   ├── program-admin.tsx
│   │   ├── program-detail-card.tsx
│   │   ├── program-list-card.tsx
│   │   ├── program-modal.tsx
│   │   ├── registration-list.tsx
│   │   ├── seating-admin.tsx
│   │   ├── settings-admin.tsx
│   │   └── sheets-sync.tsx
│   ├── register/
│   │   ├── payment-constants.ts
│   │   ├── PaymentInfo.tsx
│   │   └── RegisterForm.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dropdown-menu.tsx
├── lib/                         # Utilities and helpers
│   ├── auth.ts
│   ├── google-service-account.json
│   ├── google-sheets.ts
│   ├── prisma.ts
│   ├── sample-data.ts
│   └── utils.ts
├── prisma/                      # Database schema & migrations
│   ├── schema.prisma
│   ├── seed-program.ts
│   ├── seed.ts
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20260127161521_add_registration_model/
│           └── migration.sql
├── public/                      # Static assets
│   ├── images/
│   │   ├── auctionitemplaceholder.jpg
│   │   ├── logos/
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── favicon.ico
│   │   │   ├── logomini.png
│   │   │   └── tfnlogo.png
│   │   ├── placeholderimg.png
│   │   ├── seatplaceholder.png
│   │   └── userplaceholder.png
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts/                     # Utility scripts
│   ├── hash-password.ts
│   └── init-seats.ts
├── styles/                      # CSS & design tokens
│   ├── admin-dashboard.module.css
│   ├── brand-colors.ts
│   ├── brand-radius.ts
│   ├── brand-shadows.ts
│   ├── brand-spacing.ts
│   ├── brand-typography.ts
│   ├── homepage.module.css
│   └── register.module.css
├── .env.example                 # Example environment variables
├── DEPLOYMENT.md                # Deployment instructions
├── PROJECT_SUMMARY.md           # Feature and implementation summary
├── README.md                    # User-facing overview
├── README.tech.md               # Technical overview (this file)
├── SETUP.md                     # Local setup instructions
├── migrate.txt
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── ...
```

## 📊 Database Schema (Prisma)

- **Seat:** Seating assignments (table, seat, guest info)
- **AuctionItem:** Auction items with bids
- **Bid:** Bid history
- **Admin:** Admin users (simple auth)
- **ImageResource:** Google Drive image metadata (label, fileId, alt, type)

## 🔐 Authentication

- Email/password login for admin
- Passwords hashed with bcryptjs
- Session cookies for protected routes
- Middleware for admin route protection

## 🔗 Google Sheets Integration

- Service account credentials in `lib/google-service-account.json`
- Sync and export endpoints in `/api/admin/sheets/`
- Admin dashboard button for manual sync

## 📝 Environment Variables

- See `.env.example` for all required variables (DB, Google Sheets, admin password hash, etc.)

## 🚢 Deployment

- Ready for Vercel or similar platforms
- Prisma migrations and seed scripts included
- See `DEPLOYMENT.md` for details

## 🧩 Key Components

- `components/admin-dashboard.tsx`: Main admin UI, tabbed dashboard
- `components/admin/`: Admin features (seating, auction, program, images, settings)
- `components/register/PaymentInfo.tsx`: Payment QR logic, fallback image
- `lib/prisma.ts`: Prisma client
- `lib/auth.ts`: Auth helpers
- `lib/google-sheets.ts`: Sheets integration

## 🛡️ API Routes

- RESTful endpoints under `/api/`
- Public: seating, auction, program
- Admin: CRUD for seating, auction, images, program, login/logout, sheets sync

## 🧪 Testing & Development

- Local dev: `npm run dev`
- DB setup: `npx prisma db push`, `npx tsx scripts/init-seats.ts`
- Hash admin password: `npx tsx scripts/hash-password.ts "your-password"`

## 📝 Contributing

- Private project for Gala 2026 event
- See `README.md` for user-facing overview

---

For further details, see `PROJECT_SUMMARY.md`, `SETUP.md`, and `DEPLOYMENT.md`.
