import { Button, Chip, Stack, Tooltip, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePlayer } from '../hooks/usePlayer';

export default function PlayerStatus({ compact = false }: { compact?: boolean }) {
  const {
    user,
    stats,
    livePlayers,
    authReady,
    authError,
    cloudEnabled,
    signInWithGoogle,
    signOutPlayer,
  } = usePlayer();

  return (
    <Stack
      direction={compact ? 'column' : 'row'}
      spacing={1}
      alignItems={compact ? 'stretch' : 'center'}
      sx={{ minWidth: compact ? 'auto' : 0 }}
    >
      <Tooltip title="Players with an active presence heartbeat">
        <Chip icon={<GroupsIcon />} label={`${livePlayers} live`} size="small" color="secondary" variant="outlined" />
      </Tooltip>
      <Chip label={`Lv ${stats.level}`} size="small" color="primary" />
      <Chip label={`${stats.xp} XP`} size="small" variant="outlined" />

      {user ? (
        <Button size="small" variant="outlined" startIcon={<LogoutIcon />} onClick={signOutPlayer}>
          Sign out
        </Button>
      ) : (
        <Button
          size="small"
          variant="contained"
          startIcon={<GoogleIcon />}
          disabled={!authReady || !cloudEnabled}
          onClick={signInWithGoogle}
        >
          Connect Google
        </Button>
      )}

      {compact && authError && (
        <Typography variant="caption" color="error">
          {authError}
        </Typography>
      )}
      {!compact && !cloudEnabled && (
        <Tooltip title="Add Vite Supabase environment variables to enable Google sign-in, Postgres stats, and realtime presence.">
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Guest mode
          </Typography>
        </Tooltip>
      )}
    </Stack>
  );
}
