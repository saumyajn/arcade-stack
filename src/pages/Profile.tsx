import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import InsightsIcon from '@mui/icons-material/Insights';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Link } from 'react-router-dom';
import { games } from '../data/games';
import { NeonPanel, StatTile } from '../components/MotionBits';
import { usePlayer } from '../hooks/usePlayer';
import type { GameOutcome } from '../context/playerTypes';

const LEVEL_XP = 250;

const outcomeColors: Record<GameOutcome, 'success' | 'error' | 'warning' | 'secondary' | 'primary'> = {
  win: 'success',
  complete: 'success',
  loss: 'error',
  draw: 'warning',
  played: 'primary',
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

export default function Profile() {
  const {
    user,
    stats,
    sessions,
    displayName,
    avatarUrl,
    cloudEnabled,
    authReady,
    signInWithGoogle,
  } = usePlayer();
  const currentLevelXp = stats.xp % LEVEL_XP;
  const progress = Math.round((currentLevelXp / LEVEL_XP) * 100);
  const favoriteGame = Object.entries(
    sessions.reduce<Record<string, number>>((acc, session) => {
      acc[session.gameId] = (acc[session.gameId] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0];
  const favoriteName = games.find((game) => game.id === favoriteGame?.[0])?.name ?? 'Play a game';

  return (
    <Box sx={{ py: { xs: 2, md: 4 } }}>
      <NeonPanel glow="secondary" sx={{ p: { xs: 2.5, md: 4 }, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={avatarUrl ?? undefined} sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontWeight: 900 }}>
              {displayName.slice(0, 1).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 900 }}>
                Player Profile
              </Typography>
              <Typography variant="h3">{displayName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user ? 'Cloud stats synced with Supabase.' : 'Guest stats are saved locally until Google is connected.'}
              </Typography>
            </Box>
          </Stack>
          {!user && (
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              disabled={!authReady || !cloudEnabled}
              onClick={signInWithGoogle}
              sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}
            >
              Connect Google
            </Button>
          )}
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Level {stats.level}</Typography>
            <Typography variant="caption" color="text.secondary">
              {currentLevelXp}/{LEVEL_XP} XP to Level {stats.level + 1}
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 999 }} />
        </Box>
      </NeonPanel>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <StatTile label="total xp" value={String(stats.xp)} tone="primary" />
        <StatTile label="games played" value={String(stats.gamesPlayed)} tone="secondary" />
        <StatTile label="wins" value={String(stats.wins)} tone="warning" />
        <StatTile label="favorite" value={favoriteName} tone="primary" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.8fr 1.2fr' }, gap: 3 }}>
        <NeonPanel glow="primary" sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Typography variant="h5">Achievement Snapshot</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip icon={<MilitaryTechIcon />} label={`${stats.wins} wins`} color="success" variant="outlined" />
              <Chip icon={<SportsEsportsIcon />} label={`${stats.losses} losses`} color="error" variant="outlined" />
              <Chip icon={<InsightsIcon />} label={`${stats.draws} draws`} color="warning" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              This profile turns the arcade into a real product surface: authenticated identity, persistent telemetry,
              game sessions, levels, and progression feedback.
            </Typography>
            <Button component={Link} to="/games/context-climb" variant="outlined">
              Play Context Climb
            </Button>
          </Stack>
        </NeonPanel>

        <NeonPanel glow="secondary" sx={{ p: 2.5 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Recent Game Sessions
          </Typography>
          <TableContainer>
            <Table size="small" aria-label="Recent game sessions">
              <TableHead>
                <TableRow>
                  <TableCell>Game</TableCell>
                  <TableCell>Outcome</TableCell>
                  <TableCell align="right">XP</TableCell>
                  <TableCell>Played</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.length ? sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{games.find((game) => game.id === session.gameId)?.name ?? session.gameId}</TableCell>
                    <TableCell>
                      <Chip label={session.outcome} size="small" color={outcomeColors[session.outcome]} variant="outlined" />
                    </TableCell>
                    <TableCell align="right">{session.xp}</TableCell>
                    <TableCell>{formatDate(session.playedAt)}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary">
                        No sessions yet. Play any game to start building your profile history.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </NeonPanel>
      </Box>
    </Box>
  );
}
