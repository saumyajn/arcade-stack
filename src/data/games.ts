import { coverArt } from '../utils/coverArt';

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
    id: 'battleship',
    name: 'Battleship',
    path: '/games/battleship',
    image: coverArt.battleship,
    description: 'Drag ships, manage turns, and play against a simple CPU opponent.',
    tags: ['Grid logic', 'Drag and drop', 'Game AI'],
    engine: 'React bot',
    status: 'live',
  },
  {
    id: 'hangman',
    name: 'Hangman',
    path: '/games/hangman',
    image: coverArt.hangman,
    description: 'A classic Python word game adapted into an interactive React shell.',
    tags: ['Python', 'Interop', 'Terminal UI'],
    engine: 'Python in browser',
    status: 'live',
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    path: '/games/memory-match',
    image: coverArt['memory-match'],
    description: 'Flip cards, match pairs, and optimize attempts in a shuffled memory grid.',
    tags: ['Shuffle', 'Matching', 'State timing'],
    engine: 'React',
    status: 'live',
  },
  {
    id: 'number-guess',
    name: 'Number Guess',
    path: '/games/number-guess',
    image: coverArt['number-guess'],
    description: 'Beat the bot by finding its hidden number with bounded attempts and feedback.',
    tags: ['Input UX', 'Bot target', 'Feedback'],
    engine: 'React bot',
    status: 'live',
  },
  {
    id: 'rock-paper-scissors',
    name: 'Rock Paper Scissors',
    path: '/games/rock-paper-scissors',
    image: coverArt['rock-paper-scissors'],
    description: 'A fast reaction game with score tracking, animation, and instant feedback.',
    tags: ['Bot duel', 'State machine', 'Animation'],
    engine: 'React bot',
    status: 'live',
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    path: '/games/tic-tac-toe',
    image: coverArt['tic-tac-toe'],
    description: 'Play X against a simple bot with turn handling, winner detection, and draw state.',
    tags: ['Bot opponent', 'Win detection', 'Turns'],
    engine: 'React bot',
    status: 'live',
  },
  {
    id: 'treasure-island',
    name: 'Treasure Island',
    path: '/games/treasure-island',
    image: coverArt['treasure-island'],
    description: 'A browser-run Python adventure powered by a Pyodide web worker.',
    tags: ['Python', 'Pyodide', 'Worker'],
    engine: 'Python in browser',
    status: 'live',
  },
  {
    id: 'word-match',
    name: 'Word Match',
    path: '/games/word-match',
    image: coverArt['word-match'],
    description: 'Guess the bot-chosen word from short clues before the attempt limit runs out.',
    tags: ['Word clues', 'Bot word', 'Attempts'],
    engine: 'React bot',
    status: 'live',
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    path: '/games/unscramble',
    image: coverArt['word-scramble'],
    description: 'A vocabulary puzzle with online word generation and offline fallback.',
    tags: ['API fallback', 'Scoring', 'UX states'],
    engine: 'React + API',
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
