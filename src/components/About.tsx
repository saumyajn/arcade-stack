import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { liveGames } from '../data/games';
import { NeonPanel, ShinyText } from './MotionBits';

const techStack = ['React 19', 'TypeScript', 'Vite', 'MUI', 'Framer Motion', 'Pyodide'];

const proofPoints = [
  {
    title: 'Modular game platform',
    detail: 'Each game owns its route and interaction model while sharing a common app shell, navigation, and design system.',
  },
  {
    title: 'Browser Python runtime',
    detail: 'Python games run through Pyodide in a web worker, keeping the UI responsive while scripts execute.',
  },
  {
    title: 'Resilient gameplay',
    detail: 'Word Scramble uses a remote word API with an offline fallback so the experience degrades gracefully.',
  },
  {
    title: 'Recruiter-friendly surface',
    detail: 'The app now highlights architecture, tradeoffs, interaction patterns, and next improvements directly in the UI.',
  },
];

const roadmap = [
  'Playwright smoke tests for every game route.',
  'Keyboard alternatives for Battleship ship placement.',
  'Persistent local high scores, then optional authenticated leaderboards.',
  'Custom cover assets for Python games.',
  'Shared turn-based game engine helpers.',
];

export default function About() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <NeonPanel
        glow="primary"
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3,
        }}
      >
        <Chip label="Project Case Study" color="primary" variant="outlined" sx={{ mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          <ShinyText>Arcade Stack</ShinyText>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 820, lineHeight: 1.7 }}>
          A mini-game platform built to show frontend architecture, game-state thinking,
          accessible interaction design, and Python-to-browser interoperability.
        </Typography>
      </NeonPanel>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' }, gap: 3 }}>
        <NeonPanel glow="secondary" sx={{ p: { xs: 2.5, md: 3 } }}>
          <Typography variant="h5" gutterBottom>
            What It Demonstrates
          </Typography>
          <Stack spacing={1.5}>
            {proofPoints.map((point) => (
              <NeonPanel
                key={point.title}
                glow="primary"
                sx={{
                  p: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {point.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {point.detail}
                </Typography>
              </NeonPanel>
            ))}
          </Stack>
        </NeonPanel>

        <NeonPanel glow="warning" sx={{ p: { xs: 2.5, md: 3 } }}>
          <Typography variant="h5" gutterBottom>
            Stack
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {techStack.map((tech) => (
              <Chip key={tech} label={tech} variant="outlined" color="secondary" />
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Playable Modules
          </Typography>
          <Stack spacing={1}>
            {liveGames.map((game) => (
              <Box
                key={game.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {game.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.engine}
                </Typography>
              </Box>
            ))}
          </Stack>
        </NeonPanel>
      </Box>

      <NeonPanel glow="primary" sx={{ mt: 3, p: { xs: 2.5, md: 3 } }}>
        <Typography variant="h5" gutterBottom>
          Production Roadmap
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 1.5 }}>
          {roadmap.map((item) => (
            <Box key={item} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="body2" color="text.secondary">
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </NeonPanel>
    </Box>
  );
}
