# Arcade Stack

Arcade Stack is a React + TypeScript mini-game platform with browser games, reusable game shells, local game state, API fallback handling, and Python execution through Pyodide.

## Why This Project Matters

This project is a recruiter-facing frontend case study because it shows more than static UI:

- Modular game routes with lazy loading.
- Multiple interaction models: boards, cards, text input, scoring, reset flows, and drag/drop.
- Python scripts running in the browser through a web worker.
- Graceful fallback behavior for network-dependent gameplay.
- A scalable path toward leaderboards, user stats, and reusable game engines.

## Current Games

- Rock Paper Scissors
- Battleship
- Word Scramble
- Treasure Island
- Hangman
- Tic Tac Toe
- Memory Match
- Number Guess

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- Framer Motion
- Pyodide web worker

## Local Development

```bash
npm install
npm run dev
```

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
- Add persistent local high scores, then optional authenticated leaderboards.
- Add generated or custom cover assets for Python games.
- Add error boundaries around Pyodide initialization and remote word API calls.
- Extract reusable helpers for turn-based and card-matching games.
