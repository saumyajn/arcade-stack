import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';

const techStack = ['React 19', 'TypeScript', 'Vite', 'MUI', 'Framer Motion', 'Pyodide'];
const games = ['Battleship', 'Rock Paper Scissors', 'Word Scramble', 'Treasure Island', 'Hangman'];
const proofPoints = [
  'Modular route-per-game architecture with lazy loading.',
  'Browser Python execution through a dedicated web worker.',
  'API fallback behavior for Word Scramble so the game remains playable offline.',
  'Reusable scoring and interaction patterns that can grow into leaderboards.',
];

export default function About() {
  return (
    <Box sx={{ maxWidth: 980, mx: 'auto', py: { xs: 4, md: 6 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: '1px solid rgba(24, 33, 64, 0.1)',
          boxShadow: '0 18px 45px rgba(31, 24, 64, 0.08)',
        }}
      >
        <Chip label="Project Case Study" color="primary" variant="outlined" sx={{ mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          About Arcade Stack
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.8 }}>
          Arcade Stack is a mini-game platform built to practice frontend architecture, game state,
          animation, offline-friendly UX, and browser-based Python execution. It is intentionally
          small, but it has enough variety to show reusable patterns across different game types.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Technical Highlights
            </Typography>
            <Stack spacing={1.25}>
              {proofPoints.map((point) => (
                <Paper
                  key={point}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(91, 63, 214, 0.06)',
                    border: '1px solid rgba(91, 63, 214, 0.12)',
                  }}
                >
                  <Typography variant="body2">{point}</Typography>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              Stack
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {techStack.map((tech) => (
                <Chip key={tech} label={tech} variant="outlined" color="secondary" />
              ))}
            </Stack>

            <Typography variant="h5" gutterBottom>
              Playable Games
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {games.map((game) => (
                <Chip key={game} label={game} color="primary" />
              ))}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Next Improvements
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
          The strongest next steps are persistent leaderboards, keyboard accessibility checks,
          Cypress or Playwright smoke tests for each game, and a small game-engine abstraction for
          turn-based games.
        </Typography>
      </Paper>
    </Box>
  );
}
