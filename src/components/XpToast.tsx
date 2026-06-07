import { Alert, Box, Snackbar, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { games } from '../data/games';
import { usePlayer } from '../hooks/usePlayer';

export default function XpToast() {
  const { lastAward, dismissAward } = usePlayer();
  const gameName = games.find((game) => game.id === lastAward?.gameId)?.name ?? 'Game';

  return (
    <Snackbar
      open={Boolean(lastAward)}
      autoHideDuration={3600}
      onClose={dismissAward}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        icon={<AutoAwesomeIcon />}
        severity="success"
        onClose={dismissAward}
        sx={{
          alignItems: 'center',
          border: '1px solid rgba(45,212,191,0.35)',
          boxShadow: '0 18px 50px rgba(45,212,191,0.18)',
        }}
      >
        <Box>
          <Typography variant="subtitle2">+{lastAward?.xp ?? 0} XP added</Typography>
          <Typography variant="caption" color="text.secondary">
            {gameName} session saved as {lastAward?.outcome}.
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
}
