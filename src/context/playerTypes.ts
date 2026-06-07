import type { User } from '@supabase/supabase-js';

export type GameOutcome = 'win' | 'loss' | 'draw' | 'complete' | 'played';

export type GameResultInput = {
  gameId: string;
  outcome: GameOutcome;
  xp: number;
  score?: number;
  metadata?: Record<string, string | number | boolean | null>;
};

export type GameSessionRecord = {
  id: string;
  gameId: string;
  outcome: GameOutcome;
  xp: number;
  score: number | null;
  metadata: Record<string, string | number | boolean | null>;
  playedAt: string;
};

export type XpAward = {
  gameId: string;
  xp: number;
  outcome: GameOutcome;
};

export type PlayerStats = {
  xp: number;
  level: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
};

export type PlayerContextValue = {
  user: User | null;
  stats: PlayerStats;
  livePlayers: number;
  authReady: boolean;
  authError: string | null;
  cloudEnabled: boolean;
  sessions: GameSessionRecord[];
  displayName: string;
  avatarUrl: string | null;
  lastAward: XpAward | null;
  dismissAward: () => void;
  signInWithGoogle: () => Promise<void>;
  signOutPlayer: () => Promise<void>;
  recordGameResult: (result: GameResultInput) => void;
};
