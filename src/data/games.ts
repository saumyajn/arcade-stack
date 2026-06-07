export type GameStatus = 'live' | 'planned';

export type GameMeta = {
  id: string;
  name: string;
  path: string;
  image: string;
  description: string;
  tags: string[];
  engine: string;
  status: GameStatus;
};

export const games: GameMeta[] = [
  {
    id: 'rock-paper-scissors',
    name: 'Rock Paper Scissors',
    path: '/games/rock-paper-scissors',
    image: '/assets/images/rps-cover.png',
    description: 'A fast reaction game with score tracking, animation, and instant feedback.',
    tags: ['React', 'State machine', 'Animation'],
    engine: 'React',
    status: 'live',
  },
  {
    id: 'battleship',
    name: 'Battleship',
    path: '/games/battleship',
    image: '/assets/images/battleship.gif',
    description: 'Drag ships, manage turns, and play against a simple CPU opponent.',
    tags: ['Grid logic', 'Drag and drop', 'Game AI'],
    engine: 'React',
    status: 'live',
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    path: '/games/unscramble',
    image: '/assets/images/scramble-cover.png',
    description: 'A vocabulary puzzle with online word generation and offline fallback.',
    tags: ['API fallback', 'Scoring', 'UX states'],
    engine: 'React + API',
    status: 'live',
  },
  {
    id: 'treasure-island',
    name: 'Treasure Island',
    path: '/games/treasure-island',
    image: '/assets/images/coming-soon.png',
    description: 'A browser-run Python adventure powered by a Pyodide web worker.',
    tags: ['Python', 'Pyodide', 'Worker'],
    engine: 'Python in browser',
    status: 'live',
  },
  {
    id: 'hangman',
    name: 'Hangman',
    path: '/games/hangman',
    image: '/assets/images/coming-soon.png',
    description: 'A classic Python word game adapted into an interactive React shell.',
    tags: ['Python', 'Interop', 'Terminal UI'],
    engine: 'Python in browser',
    status: 'live',
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    path: '/games/tic-tac-toe',
    image: '/assets/images/coming-soon.png',
    description: 'A compact board game with turn handling, winner detection, and draw state.',
    tags: ['Board logic', 'Win detection', 'Turns'],
    engine: 'React',
    status: 'live',
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    path: '/games/memory-match',
    image: '/assets/images/coming-soon.png',
    description: 'Flip cards, match pairs, and optimize attempts in a shuffled memory grid.',
    tags: ['Shuffle', 'Matching', 'State timing'],
    engine: 'React',
    status: 'live',
  },
  {
    id: 'number-guess',
    name: 'Number Guess',
    path: '/games/number-guess',
    image: '/assets/images/coming-soon.png',
    description: 'Guess a hidden number with bounded attempts and clear feedback after each try.',
    tags: ['Input UX', 'Feedback', 'Random state'],
    engine: 'React',
    status: 'live',
  },
  {
    id: 'next-game',
    name: 'Next Game Slot',
    path: '',
    image: '/assets/images/coming-soon.png',
    description: 'Reserved for the next game module, leaderboard, or multiplayer experiment.',
    tags: ['Roadmap'],
    engine: 'Planned',
    status: 'planned',
  },
];

export const liveGames = games.filter((game) => game.status === 'live');
