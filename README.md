# Arcade Stack

Arcade Stack is a React + TypeScript mini-game platform with browser games, reusable game shells, local game state, API fallback handling, and Python execution through Pyodide.

## Why This Project Matters

This project is a recruiter-facing frontend case study because it shows more than static UI:

- Modular game routes with lazy loading.
- Multiple interaction models: boards, cards, text input, scoring, reset flows, and drag/drop.
- Python scripts running in the browser through a web worker.
- Graceful fallback behavior for network-dependent gameplay.
- A scalable path toward leaderboards, user stats, and reusable game engines.
- Optional Google sign-in with Supabase-backed XP, levels, game history, and live-player presence.
- Custom local SVG cover art for every existing game, avoiding external asset licensing risk.

## Current Games

- Rock Paper Scissors
- Battleship
- Word Scramble
- Treasure Island
- Hangman
- Tic Tac Toe
- Memory Match
- Number Guess
- Context Climb

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- Framer Motion
- Pyodide web worker
- Supabase Auth, Postgres, Row Level Security, and Realtime Presence

## Local Development

```bash
npm install
npm run dev
```

The app works without Supabase. In that mode it stores guest XP and levels in `localStorage`.

## Optional Supabase Setup

Create a `.env.local` file when you want Google login, cloud stats, and live-player counts:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can use [supabase.env.example](C:/Users/saumy/Code/react/arcade-stack/supabase.env.example) as the template.

Enable Google as a sign-in provider in Supabase Auth. Then run [docs/supabase-schema.sql](C:/Users/saumy/Code/react/arcade-stack/docs/supabase-schema.sql) in the Supabase SQL editor.

Postgres stores:

- `players`: profile, XP, level, games played, wins, losses, draws.
- `game_sessions`: game id, outcome, XP, score, metadata, played timestamp.

Supabase Realtime Presence tracks live players in the browser session without a separate presence table.

## Verification

```bash
npm run lint
npm run build
```

## Static Deployment

This app can deploy as a static Vite site because the Python games run in the browser through Pyodide.

```bash
npm run build
```

Deploy the generated `dist/` folder to Vercel, Netlify, Render Static Site, Firebase Hosting, GitHub Pages, or any static host.

Important static assets:

- `public/pyodideWorker.js`
- `public/treasure_island.py`
- `public/hangman/hangman.py`
- `public/hangman/hangman_words.py`
- `public/hangman/hangman_art.py`

These files must remain publicly served at the same paths because the React app fetches the Python scripts by URL.

## Python Deployment Notes

The current Python games do not require a backend server. They are client-side Python scripts loaded into Pyodide:

1. The React page loads `pyodideWorker.js`.
2. The worker loads Pyodide from the CDN.
3. The game component fetches the Python script from `public/`.
4. The worker executes the Python and returns output to React.

If you later add real Python backend features, use one of these approaches:

- FastAPI backend for server-side game sessions, leaderboards, or AI opponents.
- Render Web Service, Railway, Fly.io, or Azure App Service for the Python API.
- Keep the React frontend as a static deployment and configure `VITE_API_BASE_URL`.
- Add CORS restrictions so only the deployed frontend origin can call the API.

Example future environment variable:

```bash
VITE_API_BASE_URL=https://your-python-api.example.com
```

## Production Readiness Roadmap

- Add Playwright smoke tests for every game route.
- Add keyboard alternatives for Battleship ship placement.
- Add leaderboard views from the stored `game_sessions` data.
- Add SQL analytics views for most-played games, daily active players, and top XP earners.
- Add error boundaries around Pyodide initialization and remote word API calls.
- Extract reusable helpers for turn-based and card-matching games.
