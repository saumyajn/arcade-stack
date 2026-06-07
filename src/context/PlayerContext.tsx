import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { PlayerContext } from './playerContextBase';
import type { GameResultInput, GameOutcome, GameSessionRecord, PlayerContextValue, PlayerStats, XpAward } from './playerTypes';

const GUEST_STATS_KEY = 'arcade-stack:guest-stats';
const GUEST_SESSIONS_KEY = 'arcade-stack:guest-sessions';
const PRESENCE_SESSION_KEY = 'arcade-stack:presence-id';
const LEVEL_XP = 250;
const SESSION_LIMIT = 30;

const initialStats: PlayerStats = {
  xp: 0,
  level: 1,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

const getLevel = (xp: number) => Math.floor(xp / LEVEL_XP) + 1;

const normalizeStats = (value: unknown): PlayerStats => {
  const source = typeof value === 'object' && value !== null
    ? (value as Partial<PlayerStats> & {
        games_played?: number;
      })
    : {};
  const xp = Number(source.xp) || 0;

  return {
    xp,
    level: Number(source.level) || getLevel(xp),
    gamesPlayed: Number(source.gamesPlayed ?? source.games_played) || 0,
    wins: Number(source.wins) || 0,
    losses: Number(source.losses) || 0,
    draws: Number(source.draws) || 0,
  };
};

const loadGuestStats = () => {
  try {
    return normalizeStats(JSON.parse(localStorage.getItem(GUEST_STATS_KEY) ?? 'null'));
  } catch {
    return initialStats;
  }
};

const saveGuestStats = (stats: PlayerStats) => {
  localStorage.setItem(GUEST_STATS_KEY, JSON.stringify(stats));
};

const normalizeSession = (value: unknown): GameSessionRecord | null => {
  if (typeof value !== 'object' || value === null) return null;
  const source = value as {
    id?: string;
    gameId?: string;
    game_id?: string;
    outcome?: GameOutcome;
    xp?: number;
    score?: number | null;
    metadata?: Record<string, string | number | boolean | null>;
    playedAt?: string;
    played_at?: string;
  };
  const gameId = source.gameId ?? source.game_id;
  const playedAt = source.playedAt ?? source.played_at;
  if (!gameId || !source.outcome || !playedAt) return null;

  return {
    id: source.id ?? crypto.randomUUID(),
    gameId,
    outcome: source.outcome,
    xp: Number(source.xp) || 0,
    score: source.score ?? null,
    metadata: source.metadata ?? {},
    playedAt,
  };
};

const loadGuestSessions = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_SESSIONS_KEY) ?? '[]') as unknown[];
    return parsed.map(normalizeSession).filter((session): session is GameSessionRecord => Boolean(session));
  } catch {
    return [];
  }
};

const saveGuestSessions = (sessions: GameSessionRecord[]) => {
  localStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(sessions.slice(0, SESSION_LIMIT)));
};

const buildNextStats = (current: PlayerStats, result: GameResultInput): PlayerStats => {
  const xp = current.xp + Math.max(0, Math.round(result.xp));

  return {
    xp,
    level: getLevel(xp),
    gamesPlayed: current.gamesPlayed + 1,
    wins: current.wins + (result.outcome === 'win' || result.outcome === 'complete' ? 1 : 0),
    losses: current.losses + (result.outcome === 'loss' ? 1 : 0),
    draws: current.draws + (result.outcome === 'draw' ? 1 : 0),
  };
};

const buildSessionRecord = (result: GameResultInput): GameSessionRecord => ({
  id: crypto.randomUUID(),
  gameId: result.gameId,
  outcome: result.outcome,
  xp: Math.max(0, Math.round(result.xp)),
  score: result.score ?? null,
  metadata: result.metadata ?? {},
  playedAt: new Date().toISOString(),
});

const getPresenceId = () => {
  const existing = sessionStorage.getItem(PRESENCE_SESSION_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  sessionStorage.setItem(PRESENCE_SESSION_KEY, generated);
  return generated;
};

const getDisplayName = (user: User) => {
  const metadata = user.user_metadata as Record<string, unknown>;
  return String(metadata.full_name ?? metadata.name ?? user.email ?? 'Player');
};

const getAvatarUrl = (user: User) => {
  const metadata = user.user_metadata as Record<string, unknown>;
  const avatar = metadata.avatar_url ?? metadata.picture;
  return typeof avatar === 'string' ? avatar : null;
};

const toPlayerRow = (user: User, stats: PlayerStats) => {
  return {
    id: user.id,
    display_name: getDisplayName(user),
    email: user.email,
    avatar_url: getAvatarUrl(user),
    xp: stats.xp,
    level: stats.level,
    games_played: stats.gamesPlayed,
    wins: stats.wins,
    losses: stats.losses,
    draws: stats.draws,
    updated_at: new Date().toISOString(),
  };
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<PlayerStats>(loadGuestStats);
  const [sessions, setSessions] = useState<GameSessionRecord[]>(loadGuestSessions);
  const [livePlayers, setLivePlayers] = useState(1);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lastAward, setLastAward] = useState<XpAward | null>(null);

  useEffect(() => {
    if (!supabase) return undefined;
    const client = supabase;

    const loadPlayer = async (currentUser: User | null) => {
      setUser(currentUser);
      setAuthReady(false);

      if (!currentUser) {
        setStats(loadGuestStats());
        setSessions(loadGuestSessions());
        setAuthReady(true);
        return;
      }

      try {
        const { data, error } = await client
          .from('players')
          .select('xp, level, games_played, wins, losses, draws')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (error) throw error;

        const nextStats = data ? normalizeStats(data) : initialStats;
        setStats(nextStats);
        const { error: upsertError } = await client.from('players').upsert(toPlayerRow(currentUser, nextStats));
        if (upsertError) throw upsertError;

        const { data: sessionData, error: sessionError } = await client
          .from('game_sessions')
          .select('id, game_id, outcome, xp, score, metadata, played_at')
          .eq('user_id', currentUser.id)
          .order('played_at', { ascending: false })
          .limit(SESSION_LIMIT);

        if (sessionError) throw sessionError;
        setSessions((sessionData ?? []).map(normalizeSession).filter((session): session is GameSessionRecord => Boolean(session)));
      } catch (error) {
        console.error('Player profile load failed:', error);
        setAuthError('Could not load cloud player stats. Guest stats are still available.');
      } finally {
        setAuthReady(true);
      }
    };

    client.auth.getSession().then(({ data }) => {
      void loadPlayer(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      void loadPlayer(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLivePlayers(1);
      return undefined;
    }

    const presenceId = getPresenceId();
    const channel = supabase.channel('arcade-stack-presence', {
      config: {
        presence: {
          key: presenceId,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      setLivePlayers(Math.max(1, Object.keys(state).length));
    });

    channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') return;

      await channel.track({
        user_id: user?.id ?? null,
        display_name: user ? getDisplayName(user) : 'Guest player',
        online_at: new Date().toISOString(),
      });
    });

    return () => {
      void channel.unsubscribe();
    };
  }, [user]);

  const persistCloudResult = useCallback(
    async (nextStats: PlayerStats, result: GameResultInput) => {
      if (!user || !supabase) return;

      const { error: playerError } = await supabase.from('players').upsert(toPlayerRow(user, nextStats));
      if (playerError) throw playerError;

      const { error: sessionError } = await supabase.from('game_sessions').insert({
        user_id: user.id,
        game_id: result.gameId,
        outcome: result.outcome,
        xp: Math.max(0, Math.round(result.xp)),
        score: result.score ?? null,
        metadata: result.metadata ?? {},
        played_at: new Date().toISOString(),
      });
      if (sessionError) throw sessionError;
    },
    [user]
  );

  const recordGameResult = useCallback(
    (result: GameResultInput) => {
      const nextStats = buildNextStats(stats, result);
      const nextSession = buildSessionRecord(result);
      const nextSessions = [nextSession, ...sessions].slice(0, SESSION_LIMIT);
      setStats(nextStats);
      setSessions(nextSessions);
      setLastAward({ gameId: result.gameId, xp: Math.max(0, Math.round(result.xp)), outcome: result.outcome });

      if (user) {
        void persistCloudResult(nextStats, result).catch((error) => {
          console.error('Cloud game result save failed:', error);
          setAuthError('Could not save this round to cloud stats.');
        });
      } else {
        saveGuestStats(nextStats);
        saveGuestSessions(nextSessions);
      }
    },
    [persistCloudResult, sessions, stats, user]
  );

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      setAuthError('Supabase is not configured for Google sign-in yet.');
      return;
    }

    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }, []);

  const signOutPlayer = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const dismissAward = useCallback(() => {
    setLastAward(null);
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      user,
      stats,
      livePlayers,
      authReady,
      authError,
      cloudEnabled: isSupabaseConfigured,
      sessions,
      displayName: user ? getDisplayName(user) : 'Guest player',
      avatarUrl: user ? getAvatarUrl(user) : null,
      lastAward,
      dismissAward,
      signInWithGoogle,
      signOutPlayer,
      recordGameResult,
    }),
    [authError, authReady, dismissAward, lastAward, livePlayers, recordGameResult, sessions, signInWithGoogle, signOutPlayer, stats, user]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
