# Arcade Stack

Arcade Stack is a React + TypeScript mini-game platform that combines browser games, animated UI, local game state, API fallback handling, and Python execution through Pyodide.

## Why This Project Matters

This project is useful as a recruiter-facing frontend case study because it is not just a static UI. It shows:

- Modular game routes with lazy loading.
- Multiple interaction models: turn-based logic, drag and drop, text input, scoring, and reset flows.
- Python scripts running in the browser through a web worker.
- A real fallback path for network-dependent gameplay.
- A roadmap toward leaderboards, user stats, and testable game engines.

## Current Games

- Rock Paper Scissors
- Battleship
- Word Scramble
- Treasure Island
- Hangman

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

## Production Readiness Roadmap

- Add Playwright smoke tests for every game route.
- Add keyboard accessibility coverage for Battleship and game controls.
- Move shared game metadata into one module used by the home page and navigation.
- Add persistent local high scores, then optional authenticated leaderboards.
- Add generated or custom cover assets for Python games instead of placeholders.
- Add error boundaries around Pyodide initialization and remote word API calls.
