import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TerminalIcon from '@mui/icons-material/Terminal';
import HubIcon from '@mui/icons-material/Hub';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { games, liveGames } from '../data/games';
import { NeonPanel, ShinyText, StatTile } from '../components/MotionBits';

const MotionCard = motion(Card);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const featurePanels = [
  {
    title: 'React game states',
    detail: 'Turn logic, score loops, resets, and interaction feedback across multiple games.',
    icon: <SportsEsportsIcon />,
    tone: 'primary' as const,
  },
  {
    title: 'Python in browser',
    detail: 'Pyodide scripts run inside a worker-backed game shell without blocking the UI.',
    icon: <TerminalIcon />,
    tone: 'secondary' as const,
  },
  {
    title: 'Modular arcade',
    detail: 'Shared metadata drives navigation, cards, route modules, and the case-study page.',
    icon: <HubIcon />,
    tone: 'warning' as const,
  },
];

export default function Home() {
  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.08fr 0.92fr' },
          gap: 3,
          alignItems: 'stretch',
          mb: 3,
        }}
      >
        <NeonPanel glow="primary" sx={{ p: { xs: 3, md: 5 }, minHeight: { md: 520 } }}>
          <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1, height: '100%', justifyContent: 'space-between' }}>
            <Box>
            <Chip label="Playable React arcade" color="primary" variant="outlined" sx={{ mb: 2 }} />
              <Typography variant="h1" sx={{ maxWidth: 850, fontSize: { xs: '3rem', md: '5.8rem' }, lineHeight: 0.92 }}>
                <ShinyText>Arcade Stack</ShinyText>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.75, mt: 2 }}>
                A kinetic mini-game platform showing React architecture, reusable game shells,
                browser-run Python, resilient API fallback, and a restrained, polished game UI.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" size="large" component={Link} to={liveGames[0].path}>
                Enter arcade
              </Button>
              <Button variant="outlined" size="large" component={Link} to="/about">
                View build story
              </Button>
            </Stack>
          </Stack>
        </NeonPanel>

        <Box sx={{ display: 'grid', gridTemplateRows: { xs: 'auto', lg: '1fr auto' }, gap: 2 }}>
          <NeonPanel glow="secondary" sx={{ p: 2.5 }}>
            <Box
              sx={{
                minHeight: 260,
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.14)',
                  background:
                  'linear-gradient(180deg, rgba(45,212,191,0.1), rgba(139,92,246,0.08)), #111827',
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(rgba(255,255,255,0.025) 50%, transparent 50%)',
                  backgroundSize: '100% 12px',
                },
              }}
            >
              <Box sx={{ position: 'relative', textAlign: 'center', px: 2 }}>
                <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 900 }}>
                  Cabinet Status
                </Typography>
                <Typography variant="h3" sx={{ mt: 1 }}>
                  {liveGames.length} Games Online
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  React, browser Python, animations, and fallback UX in one playground.
                </Typography>
              </Box>
            </Box>
          </NeonPanel>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <StatTile label="routes" value={String(liveGames.length)} tone="primary" />
            <StatTile label="engines" value="2" tone="secondary" />
            <StatTile label="fallbacks" value="1" tone="warning" />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        {featurePanels.map((panel) => (
          <NeonPanel key={panel.title} glow={panel.tone} sx={{ p: 2.5 }}>
            <Box sx={{ color: `${panel.tone}.main`, mb: 1 }}>{panel.icon}</Box>
            <Typography variant="h6">{panel.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {panel.detail}
            </Typography>
          </NeonPanel>
        ))}
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4">Choose Your Machine</Typography>
          <Typography variant="body2" color="text.secondary">
            Each card is a playable module or a planned expansion slot.
          </Typography>
        </Box>
              <Chip label="Simple motion system" color="secondary" variant="outlined" />
      </Stack>

      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {games.map((game) => (
          <MotionCard
            key={game.name}
            variants={itemVariants}
            whileHover={game.status === 'planned' ? undefined : { y: -8, scale: 1.01 }}
            transition={{ duration: 0.22 }}
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 470,
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.14)',
              overflow: 'hidden',
              opacity: game.status === 'planned' ? 0.65 : 1,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))',
              boxShadow: '0 16px 42px rgba(0,0,0,0.24)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                m: 1.5,
                mb: 0,
                height: 210,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.12)',
                background:
                  'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(45,212,191,0.08)), rgba(15,23,42,0.82)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <CardMedia
                component="img"
                image={game.image}
                alt={`${game.name} cover`}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  p: 1.5,
                  filter: 'saturate(1.08) contrast(1.02)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.08), transparent 38%, rgba(15,23,42,0.24))',
                }}
              />
              <Chip
                label={game.engine}
                size="small"
                color="secondary"
                sx={{ position: 'absolute', top: 12, left: 12 }}
              />
            </Box>
            <CardContent sx={{ flex: 1, px: 2.5, pt: 2.25 }}>
              <Typography variant="h5" gutterBottom>
                {game.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                {game.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {game.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
              <Button
                fullWidth
                variant={game.status === 'planned' ? 'outlined' : 'contained'}
                disabled={game.status === 'planned'}
                component={game.status === 'planned' ? 'button' : Link}
                to={game.status === 'planned' ? undefined : game.path}
              >
                {game.status === 'planned' ? 'Coming Soon' : 'Play Machine'}
              </Button>
            </CardActions>
          </MotionCard>
        ))}
      </Box>
    </Box>
  );
}
