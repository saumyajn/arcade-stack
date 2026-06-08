import { Box, Button, Paper, Typography } from '@mui/material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import { games } from '../data/games';
import { usePlayer } from '../hooks/usePlayer';
import type { XpAward } from '../context/playerTypes';

const celebratoryOutcomes = new Set(['win', 'complete']);

export default function WinCelebration() {
  const { lastAward } = usePlayer();
  const { width, height } = useWindowSize();
  const [celebration, setCelebration] = useState<XpAward | null>(null);

  useEffect(() => {
    if (!lastAward || !celebratoryOutcomes.has(lastAward.outcome)) return undefined;

    setCelebration(lastAward);
    const timer = window.setTimeout(() => setCelebration(null), 4200);
    return () => window.clearTimeout(timer);
  }, [lastAward]);

  const gameName = games.find((game) => game.id === celebration?.gameId)?.name ?? 'Game';

  return (
    <AnimatePresence>
      {celebration && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1500,
            pointerEvents: 'none',
            display: 'grid',
            placeItems: 'center',
            px: 2,
          }}
        >
          <Confetti width={width} height={height} numberOfPieces={220} recycle={false} />
          <Paper
            component={motion.div}
            initial={{ scale: 0.86, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            elevation={0}
            sx={{
              pointerEvents: 'auto',
              width: 'min(440px, 100%)',
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid rgba(45,212,191,0.4)',
              background:
                'linear-gradient(180deg, rgba(45,212,191,0.14), rgba(139,92,246,0.12)), rgba(15,23,42,0.96)',
              boxShadow: '0 28px 80px rgba(45,212,191,0.22)',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: 'secondary.main',
                bgcolor: 'rgba(45,212,191,0.14)',
                border: '1px solid rgba(45,212,191,0.36)',
              }}
            >
              <MilitaryTechIcon fontSize="large" />
            </Box>
            <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 900 }}>
              Victory Recorded
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              {gameName} cleared
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, mb: 2.5 }}>
              +{celebration.xp} XP added to your profile.
            </Typography>
            <Button variant="contained" onClick={() => setCelebration(null)}>
              Continue
            </Button>
          </Paper>
        </Box>
      )}
    </AnimatePresence>
  );
}
