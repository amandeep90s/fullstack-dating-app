---

# FullStack Dating Website with Next.js, Supabase & Stream

<div align="center">
  <br />
  <a href="https://github.com/amandeep90s">
    <img width="1512" height="799" alt="Screenshot 2025-09-21 at 7 13 32 PM" src="https://github.com/user-attachments/assets/725dc329-95da-43db-b3e5-74ff824caee4" />
  </a>
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/-Stream-0057FF?style=for-the-badge&logo=getstream&logoColor=white" alt="Stream" />
    <img src="https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-React_Hook_Form-EC5990?style=for-the-badge&logo=react&logoColor=white" alt="React Hook Form" />
    <img src="https://img.shields.io/badge/-Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  </div>
  <h3 align="center">Build a FullStack Dating Website with Next.js, Supabase, Stream & TailwindCSS</h3>
  <div align="center">
    Follow the full video tutorial on 
    <a href="https://youtu.be/8QDT776XtO8" target="_blank"><b>YouTube</b></a>
  </div>
  <br />
</div>

## 📋 Table of Contents

1. [Introduction](#-introduction)
2. [Tech Stack](#-tech-stack)
3. [Features](#-features)
4. [Timestamps](#-timestamps)
5. [Quick Start](#-quick-start)
6. [Screenshots](#-screenshots)
7. [Deployment](#-deployment)
8. [Useful Links](#-useful-links)

---

## 🚀 Introduction

In this in-depth tutorial you'll build a production-ready **FullStack Dating Website** using **Next.js**, **Supabase** (Postgres + Realtime), and **Stream** for chat & video. We cover everything from authentication and DB schema to matching logic, realtime chat, and one-to-one video calls — a complete, intermediate → advanced project.

---

## ⚙️ Tech Stack

### Frontend Framework

- **Next.js 15.5.3** — React framework with App Router, server components, and Turbopack
- **React 19.1.1** — Latest React with concurrent features and improved performance
- **TypeScript 5.9.2** — Full type safety and modern JavaScript features

### Backend & Database

- **Supabase** — PostgreSQL database, authentication, storage, and real-time subscriptions
- **Supabase SSR** — Server-side rendering support for Supabase
- **Row Level Security (RLS)** — Database-level access control and security

### Real-time Features

- **Stream Chat** — Real-time messaging infrastructure
- **Stream Chat React** — React components for chat functionality
- **Stream Video React SDK** — WebRTC-based video calling capabilities

### Forms & Validation

- **React Hook Form** — Performant forms with minimal re-renders
- **Zod** — TypeScript-first schema validation
- **@hookform/resolvers** — Zod integration for React Hook Form

### Styling & UI

- **TailwindCSS 4.1.13** — Utility-first CSS framework
- **Tailwind Merge** — Intelligent class name merging
- **clsx** — Conditional CSS class utilities

### Development Tools

- **ESLint** — Code linting and quality enforcement
- **Prettier** — Code formatting with Tailwind CSS plugin
- **@faker-js/faker** — Realistic fake data generation for testing
- **tsx** — TypeScript execution for scripts

### Deployment & Hosting

- **Vercel** — Serverless deployment platform optimized for Next.js
- **Environment Configuration** — Secure handling of API keys and secrets

---

## ⚡️ Features

### � Authentication & Security

- **Supabase Auth** — Secure user authentication with email/password
- **Row Level Security (RLS)** — Database-level security policies
- **Session Management** — Persistent user sessions across app reloads

### 👤 User Profiles & Management

- **Profile Creation & Editing** — Complete user profiles with photos, bio, and preferences
- **Photo Upload** — Cloud storage integration for profile pictures
- **User Preferences** — Age range, distance, and gender preferences
- **Profile Validation** — Form validation with Zod schemas

### ❤️ Matching System

- **Discovery Feed** — Browse potential matches
- **Like/Unlike System** — Express interest in other users
- **Mutual Matching** — Automatic match creation when both users like each other
- **Match Notifications** — Real-time match alerts

### 💬 Real-time Communication

- **Stream Chat Integration** — One-to-one messaging with real-time updates
- **Typing Indicators** — See when others are typing
- **Message History** — Persistent chat history
- **Online Status** — User presence indicators

### 🎥 Video Calling

- **WebRTC Video Calls** — High-quality one-to-one video calls
- **Stream Video SDK** — Professional video infrastructure
- **Call Notifications** — Incoming call alerts
- **Video Call Interface** — Full-screen video experience

### 🎨 Modern UI/UX

- **Responsive Design** — Mobile-first approach with TailwindCSS
- **Dark/Light Mode Support** — Theme-aware components
- **Form Validation** — React Hook Form with real-time validation
- **Loading States** — Smooth loading indicators and transitions
- **Error Handling** — Comprehensive error boundaries and user feedback

### 🛠️ Developer Experience

- **TypeScript** — Full type safety throughout the application
- **ESLint & Prettier** — Code quality and formatting standards
- **Fake Data Seeding** — Development testing with realistic user data
- **Environment Configuration** — Secure environment variable management

### 🚀 Performance & Production

- **Next.js App Router** — Modern routing with server components
- **Server-Side Rendering** — Fast initial page loads
- **Database Optimization** — Indexed queries and efficient data fetching
- **Real-time Updates** — Live data synchronization
- **Production Deployment** — Vercel-ready configuration

---

## 👌 Quick Start

### Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- [pnpm](https://pnpm.io/) — Fast, disk space efficient package manager
- [Supabase account](https://app.supabase.com/)
- [Stream account](https://getstream.io/chat/sdk/react/?utm_source=youtube&utm_medium=referral&utm_content=&utm_campaign=pedro2025)
- [Vercel account](https://vercel.com/) for deployment

### Supabase SQL Command:

```sql
-- =====================================================
-- StreamMatch Dating App - Complete Database Schema
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
    birthdate DATE NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{"age_range": {"min": 18, "max": 50}, "distance": 25, "gender_preference": []}'::jsonb,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE public.likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    to_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_user_id, to_user_id)
);

-- Matches table
CREATE TABLE public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user1_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users table indexes
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_gender ON public.users(gender);
CREATE INDEX idx_users_birthdate ON public.users(birthdate);
CREATE INDEX idx_users_location ON public.users(location_lat, location_lng);
CREATE INDEX idx_users_last_active ON public.users(last_active);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Likes table indexes
CREATE INDEX idx_likes_from_user ON public.likes(from_user_id);
CREATE INDEX idx_likes_to_user ON public.likes(to_user_id);
CREATE INDEX idx_likes_created_at ON public.likes(created_at);

-- Matches table indexes
CREATE INDEX idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX idx_matches_created_at ON public.matches(created_at);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create match when both users like each other
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the other user has also liked this user
    IF EXISTS (
        SELECT 1 FROM public.likes
        WHERE from_user_id = NEW.to_user_id
        AND to_user_id = NEW.from_user_id
    ) THEN
        -- Create a match (avoid duplicates)
        INSERT INTO public.matches (user1_id, user2_id)
        VALUES (
            LEAST(NEW.from_user_id, NEW.to_user_id),
            GREATEST(NEW.from_user_id, NEW.to_user_id)
        )
        ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for creating matches
CREATE TRIGGER create_match_trigger AFTER INSERT ON public.likes
    FOR EACH ROW EXECUTE FUNCTION create_match_on_mutual_like();

-- Function to update user's last_active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users SET last_active = NOW() WHERE id = NEW.from_user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating last_active when user interacts
CREATE TRIGGER update_last_active_trigger AFTER INSERT ON public.likes
    FOR EACH ROW EXECUTE FUNCTION update_last_active();

-- Function to create user profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        full_name,
        username,
        email,
        gender,
        birthdate,
        bio,
        avatar_url,
        preferences
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'User'),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'user'),
        NEW.email,
        'other',
        CURRENT_DATE,
        '',
        NULL,
        '{"age_range": {"min": 18, "max": 50}, "distance": 25, "gender_preference": []}'::jsonb
    );

    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);


-- Likes table policies
CREATE POLICY "Users can view their own likes" ON public.likes
    FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create their own likes" ON public.likes
    FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can delete their own likes" ON public.likes
    FOR DELETE USING (auth.uid() = from_user_id);

-- Matches table policies
CREATE POLICY "Users can view their own matches" ON public.matches
    FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);


```

### Clone and Run

```bash
# replace with your repo when created
git clone https://github.com/amandeep90s/fullstack-dating-app.git
cd fullstack-dating-app
pnpm install
```

### Environment

Copy the example env and fill your keys:

```bash
cp .env.example .env.local
# then edit .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
# STREAM_API_KEY=
# STREAM_API_SECRET=
# NEXT_PUBLIC_CLERK_FRONTEND_API=   (if using Clerk)
```

### Database Setup (Supabase)

1. Create a new Supabase project and Postgres database.
2. Run the provided SQL (schema) file or use the SQL editor to create tables (users, profiles, matches, messages, calls).
3. Enable Realtime or replication features if you plan to use Supabase realtime.
4. Optionally run the seeder script to create fake profiles for testing:

```bash
pnpm run create-fake-profiles
```

### Code Formatting

This project uses Prettier with Tailwind CSS class sorting for consistent code formatting.

```bash
# Format all files
pnpm format

# Check if files are formatted correctly
pnpm format:check
```

Prettier is configured to:

- Sort Tailwind CSS classes automatically
- Use single quotes, semicolons, and 2-space indentation
- Format files on save in VS Code (if Prettier extension is installed)

---

## ☁️ Deployment

### Deploy on Vercel

1. Push your completed code to GitHub.
2. Go to [Vercel](https://vercel.com/).
3. Import your repository.
4. Add Environment Variables in Vercel (same as `.env.local`).
5. Set up any server-side secrets (Stream secret, Supabase service key).
6. Click **Deploy**.

Your live app will be hosted on a Vercel subdomain (e.g. `https://your-dating-app.vercel.app`).

---

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs (Auth, Database, Realtime)](https://supabase.com/docs)
- [Stream Chat & Video SDK](https://getstream.io/chat/sdk/react/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel](https://vercel.com/)
- Example / reference code used in video: [machadop1407/social-media-vite-supabase](https://github.com/machadop1407/social-media-vite-supabase)

---

If you’d like, I can:

- add the SQL schema file (`supabase/schema.sql`) and a ready-to-run seeder script,
- produce an `.env.example` with the exact keys used in the tutorial,
- or generate a complete GitHub repo structure (folders, starter files) you can copy into a new repo. Which one would you like next?
