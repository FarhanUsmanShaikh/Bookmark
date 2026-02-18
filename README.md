# 🔖 Bookmark — Digital Knowledge Vault

A high-fidelity, ultra-premium bookmark management system designed for the modern web. Built with **Next.js 14**, **Supabase**, and **Tailwind CSS**, featuring real-time synchronization and a sophisticated dark-glass aesthetic.

---

## ✨ Premium Experience

Bookmark isn't just a list of links; it's a curated archive designed with professional-grade aesthetics and physically-inspired interactions.

- 🌌 **Ultra-Dark Aesthetic**: Deep cosmic mesh gradients and multi-layered glassmorphism.
- ⚡ **Instant UI Synchronization**: Zero-latency updates for adding and deleting resources.
- 🔄 **Real-Time Engine**: Cross-session synchronization in under 2 seconds via Supabase Realtime.
- 🔐 **Private Sanctuary**: Enterprise-grade privacy with Row-Level Security (RLS).
- 🔑 **Google OAuth**: Frictionless, secure authentication without the password burden.
- 📱 **Adaptive Design**: A seamless responsive experience from mobile to ultra-wide displays.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with Custom Mesh Utilities |
| **Backend** | [Supabase](https://supabase.com/) (Auth, Database, Realtime) |
| **Icons** | Custom SVG Brand Engine |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase Project ([Create one here](https://supabase.com/))

### Installation
1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/bookmark-app.git
   cd bookmark-app
   npm install
   ```

2. **Configure Environment**
   Map your Supabase credentials in a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Launch Development**
   ```bash
   npm run dev
   ```
   Visit [localhost:3000](http://localhost:3000) to see your sanctuary live.

---

## 📁 Project Architecture

- `app/` — Next.js 14 App Router (Pages, Layouts, CSS)
- `lib/services/` — Decoupled Business Logic (Auth, Bookmark, Realtime)
- `lib/supabase/` — Database Client Configuration
- `types/` — Strict TypeScript Interfaces and Type Guards
- `supabase/migrations/` — SQL Schema and RLS Policy Definitions

---

## 🔐 Security Standards

Bookmark prioritizes your data integrity. Our multi-layer security model ensures:
1. **Database Isolation**: Every query is filtered at the PostgreSQL level via RLS.
2. **Secure Transport**: Full HTTPS encryption and secure cookie handling.
3. **No-Sensitive-Data Logging**: Performance monitoring without exposing your intellectual assets.

---

## 📦 Deployment

Bookmark is production-ready and optimized for Vercel.

**Deployed Link.** - https://bookmark-prodction.vercel.app

Built with ❤️ and logic.