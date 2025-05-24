# Social Polling App

A real-time social polling application built with Next.js, TypeScript, Tailwind CSS, and Supabase. Users can create polls, vote in real-time, and view live results with interactive charts.

## Features

- **User Authentication** - Sign up/login with email and password
- **Poll Creation** - Create multiple-choice polls with custom options
- **Real-time Voting** - Live vote updates using Supabase Realtime
- **Results Dashboard** - Interactive charts showing poll results
- **Responsive Design** - Mobile-first design for all screen sizes
- **TypeScript** - Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Charts**: Recharts
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## Installation

1. Clone the repository:

```bash
git clone https://github.com/milan-vala/social-polling-app.git
cd social-polling-app
```

2. Install dependencies
   `npm install`
3. Create environment variables `cp .env.example .env.local`
4. Add Supabase credentials to .env.local

```
NEXT_PUBLIC_SUPABASE_URL=supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key
```

5. Run the development server `npm run dev`
6. Open http://localhost:3000 in browser.

## Database Schema

The application uses three main tables:

- `polls` - Store poll information
- `poll_options` - Store poll choices/options
- `votes` - Track user votes

## Deployment
This app is designed to be deployed on Vercel:
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Responsive Design
* **Mobile:** ≤640px
* **Tablet:** 641px - 1024px
* **Desktop:** ≥1025px
