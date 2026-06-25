<div align="center">

# ⚔️ DSA Odyssey

### *Reclaim the Kingdom of Algorithms*

**A gamified, adaptive DSA practice platform for students who want proof of work — not another link dump.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003b57?style=flat-square&logo=sqlite)](https://www.sqlite.org/)

</div>

---

## 🗺️ What is DSA Odyssey?

Most students grind DSA for months and still freeze in interviews. The problem usually isn't effort — it's **order** and **feedback loops**.

DSA Odyssey turns your practice into an RPG:

- Solve **282 curated problems** (sourced from Striver's A2Z sheet) organised into **20 progressive Realms**
- Earn **XP**, build **streaks**, unlock **achievements** as you progress
- After each problem, rate how difficult it felt — the app **learns your weak spots** and automatically adapts your daily practice to drill them
- Track takeaways in a personal **Codex** — your living study notebook

> Built by a CS student who wanted one place to track DSA practice that actually felt motivating.

---

## ✨ Features

### 🎮 Gamified Progression
- 20 thematic Realms unlock in sequence — from Array Archipelago to DP Citadel
- XP system with real-time progress bars, level tiers, and streak tracking
- Realm Completion Ceremonies — animated celebrations when you clear a Realm
- Achievement system with unlockable badges

### 🧠 Adaptive Practice Engine
The standout feature. After each quest, a modal asks: **"How did this feel?"**

- 😊 Too Easy → engine accelerates your progression
- 🤔 Just Right → steady pace continues
- 😅 Too Hard → realm is flagged as a weak spot

The engine computes a **struggle score** per Realm:

```
struggleScore = (hardCount × 1.0 + mediumCount × 0.4) / totalRated
```

Any realm scoring above **0.35** with at least 2 ratings becomes a *Focus Zone*. Daily quests then automatically include bonus problems from your weakest realms — without you having to do anything.

### ⚔️ Daily Quest System
- 3 fresh problems from your active Realm every day
- Up to 2 bonus Focus problems injected from your weakest Realm
- Automatically regenerates each day; persists across sessions

### 📓 Codex — Personal Learning Journal
- After completing a quest, write your own takeaways directly in the app
- All entries are searchable and organized by Realm and pattern
- Acts as a personalised revision reference before placements

### 🌍 World Map & Smart Practice Hub
- Visual world map showing per-Realm completion percentages
- `/practice` page with Pattern Strength Radar and Focus Zone cards
- See exactly which patterns you're strong in vs. where you're struggling

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Browser (Port 3000)             │
│                                             │
│    Next.js 16 — App Router + Turbopack      │
│    ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│    │  Pages   │  │Components│  │  State  │ │
│    │ /kingdom │  │ Sidebar  │  │GameCtx  │ │
│    │ /today   │  │ Modals   │  │Reducer  │ │
│    │ /world   │  │ StatsBar │  │         │ │
│    │ /practice│  │          │  │         │ │
│    └──────────┘  └──────────┘  └─────────┘ │
└───────────────────┬─────────────────────────┘
                    │ HTTP + JWT Bearer Token
┌───────────────────▼─────────────────────────┐
│              Backend (Port 5000)             │
│                                             │
│    Express.js — Layered Architecture        │
│    Routes → Controllers → Repositories      │
│                    │                        │
│             SQLite Database                 │
│          (dsa_odyssey.db)                   │
└─────────────────────────────────────────────┘
```

### Backend Layer Breakdown

| Layer | Responsibility |
|---|---|
| **Routes** | Map HTTP method + URL path to controller method |
| **Controllers** | Validate input, call repositories/services, format response |
| **Repositories** | Raw SQL queries — the only code that touches the database |
| **Services** | Business logic (e.g. XP recalculation) that spans multiple repositories |
| **Middleware** | JWT verification on every protected route |

### Frontend State Architecture

State is managed with React's built-in `useReducer` + `Context` — no Redux needed.

```
GameContext.tsx          ← The coordinator. Loads data, exposes actions.
    │
    ├── gameReducer.ts   ← Pure function: (state, action) → newState
    │
    └── GameState.ts     ← TypeScript interface: shape of all state
```

Every UI component calls `useGame()` to read state or trigger actions. All server syncing happens inside `GameContext` — components stay simple.

---

## 🗃️ Database Schema

Four SQLite tables:

```sql
-- Login accounts
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,         -- bcrypt, never plain text
  created_at    TEXT DEFAULT (datetime('now'))
);

-- Per-user game progress
CREATE TABLE user_state (
  user_id          INTEGER PRIMARY KEY,
  xp               INTEGER DEFAULT 0,
  streak           INTEGER DEFAULT 0,
  best_streak      INTEGER DEFAULT 0,
  last_activity    TEXT,
  inventory        TEXT DEFAULT '[]',  -- JSON
  achievements     TEXT DEFAULT '{}',  -- JSON
  daily_quests     TEXT DEFAULT '[]',  -- JSON array of qids
  daily_quest_date TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Every completed problem
CREATE TABLE completed_quests (
  user_id      INTEGER NOT NULL,
  qid          TEXT NOT NULL,
  completed_at TEXT DEFAULT (date('now')),
  notes        TEXT DEFAULT '',
  felt         TEXT DEFAULT '',       -- 'easy' | 'medium' | 'hard'
  PRIMARY KEY (user_id, qid)
);

-- Personal Codex entries
CREATE TABLE codex_entries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  qid        TEXT NOT NULL,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL DEFAULT '',
  realm_id   TEXT NOT NULL,
  pattern    TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

---

## 🗂️ Project Structure

```
dsa_odyssey/
├── backend/
│   ├── server.js                  ← Entry point (port 5000)
│   ├── data/dsa_odyssey.db        ← SQLite database (gitignored)
│   └── src/
│       ├── config/env.js          ← PORT + JWT_SECRET from env vars
│       ├── db/
│       │   ├── init.js            ← Schema creation + safe migrations
│       │   └── sqlite.js          ← getRow / getRows / runQuery helpers
│       ├── middleware/
│       │   └── auth.middleware.js ← JWT verification
│       ├── repositories/          ← SQL query layer
│       ├── services/
│       │   └── xp.service.js      ← XP recalculated from source of truth
│       ├── controllers/           ← Request handling
│       └── routes/                ← URL → controller mapping
│
└── frontend/
    └── src/
        ├── app/                   ← Next.js App Router pages
        │   ├── page.tsx           ← Landing page
        │   ├── login/             ← Auth page
        │   └── (game)/            ← Authenticated game pages
        │       ├── layout.tsx     ← Sidebar + global modals
        │       ├── kingdom/       ← Dashboard
        │       ├── today/         ← Daily quests
        │       ├── world/         ← Realm world map
        │       ├── realm/[id]/    ← Per-realm question list
        │       ├── practice/      ← Adaptive insights hub
        │       └── codex/         ← Personal notes
        ├── constants/
        │   ├── realms.ts          ← All 282 questions across 20 realms
        │   └── insights.ts        ← Adaptive algorithm (struggle score)
        ├── store/
        │   ├── GameContext.tsx    ← Global state coordinator
        │   └── gameReducer.ts     ← State machine
        ├── services/              ← API call wrappers (authFetch)
        ├── types/GameState.ts     ← TypeScript interfaces
        └── features/dashboard/
            └── components/        ← FeedbackModal, PracticeInsightsPanel, etc.
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

### 1. Clone & Install

```bash
git clone https://github.com/your-username/dsa-odyssey.git
cd dsa-odyssey

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment (Optional)

The app runs with sensible defaults. To customise:

```bash
# backend/.env  (create this file — it's gitignored)
JWT_SECRET=your_custom_secret_here
PORT=5000
```

If no `.env` is provided, the backend uses `port 5000` and a default JWT secret suitable for local development.

### 3. Run

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm start
# → Backend running on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → Next.js ready on http://localhost:3000
```

Visit **http://localhost:3000**, register an account, and start your odyssey.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | ❌ | Create account |
| POST | `/api/login` | ❌ | Login, returns JWT |
| GET | `/api/state` | ✅ | Full user game state |
| POST | `/api/state` | ✅ | Update game state fields |
| POST | `/api/complete` | ✅ | Mark quest complete / uncomplete |
| POST | `/api/notes` | ✅ | Save notes for a question |
| POST | `/api/codex` | ✅ | Save Codex entry |
| GET | `/api/codex` | ✅ | Get all Codex entries |
| POST | `/api/feedback` | ✅ | Save difficulty rating (felt) |
| GET | `/api/insights` | ✅ | Get all felt ratings for adaptive engine |

All protected routes require: `Authorization: Bearer <token>`

---

## 🌍 The 20 Realms

| # | Realm | Pattern Focus | Questions |
|---|-------|--------------|-----------|
| 1 | Array Archipelago | Traversal, Prefix | 18 |
| 2 | Hash Highlands | HashMaps | 10 |
| 3 | Two-Pointer Pass | Two Pointers | 10 |
| 4 | Sliding Sanctum | Sliding Window | 8 |
| 5 | Prefix Peaks | Prefix Sums | 8 |
| 6 | Binary Search Bastion | Binary Search | 12 |
| 7 | Linked List Labyrinth | Linked Lists | 14 |
| 8 | Stack Spire | Stack / Queue | 12 |
| 9 | Heap Highlands | Priority Queue | 8 |
| 10 | Backtrack Badlands | Recursion / Backtracking | 12 |
| 11 | Tree Temple | Binary Trees | 17 |
| 12 | BST Battlegrounds | Binary Search Trees | 10 |
| 13 | DFS Dungeon | Depth-First Search | 14 |
| 14 | BFS Battlefield | Breadth-First Search | 10 |
| 15 | DSU Domain | Union-Find | 8 |
| 16 | DP Dominion I | 1D Dynamic Programming | 16 |
| 17 | DP Dominion II | Grid / 2D DP | 14 |
| 18 | Greedy Gardens | Greedy Algorithms | 11 |
| 19 | Trie Tower | Trie Data Structure | 7 |
| 20 | Bit Manipulation Bay | Bit Operations | 10 |

**Total: 282 problems**

---

## 🔐 Security

- Passwords are hashed with **bcryptjs** (10 salt rounds) — plain-text passwords are never stored
- Sessions use **JWT tokens** with 30-day expiry — stateless, no session table
- The SQLite database file is listed in `.gitignore` and will never be committed
- JWT secret is read from `process.env.JWT_SECRET` — never hardcoded for production

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend framework | Next.js 16 (App Router) | File-based routing, React Server Components ready |
| UI library | React 19 | Latest concurrent features |
| Language | TypeScript | Type-safe state management across the full frontend |
| Styling | Vanilla CSS + CSS Variables | Zero dependencies, full control over the RPG theme |
| State management | React Context + useReducer | Native React, no extra libraries |
| Backend | Express.js (Node.js) | Lightweight, minimal setup |
| Database | SQLite3 | Zero-config, single-file, perfect for local-first apps |
| Auth | JWT + bcryptjs | Stateless, secure, standard |
| Dev bundler | Turbopack (Next.js default) | Fastest local dev builds |

---

## 📄 License

MIT — feel free to fork, modify, and build on it.

---

<div align="center">

Built with ⚔️ for students who want to actually get good at DSA.

*"Every great coder started with zero. Your journey begins with a single quest."*

</div>
