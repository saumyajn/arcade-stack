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
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

type GameCard = {
  name: string;
  image: string;
  path: string;
  description: string;
  tags: string[];
  disabled?: boolean;
};

const games: GameCard[] = [
  {
    name: 'Rock Paper Scissors',
    image: '/assets/images/rps-cover.png',
    path: '/games/rock-paper-scissors',
    description: 'A fast reaction game with score tracking, animation, and instant feedback.',
    tags: ['React', 'State machine', 'Animation'],
  },
  {
    name: 'Battleship',
    image: '/assets/images/battleship.gif',
    path: '/games/battleship',
    description: 'Drag ships, manage turns, and play against a simple CPU opponent.',
    tags: ['Grid logic', 'Drag and drop', 'Game AI'],
  },
  {
    name: 'Word Scramble',
    image: '/assets/images/scramble-cover.png',
    path: '/games/unscramble',
    description: 'A timed vocabulary puzzle with online word generation and offline fallback.',
    tags: ['API fallback', 'Scoring', 'UX states'],
  },
  {
    name: 'Treasure Island',
    image: '/assets/images/coming-soon.png',
    path: '/games/treasure-island',
    description: 'A browser-run Python adventure powered by a Pyodide web worker.',
    tags: ['Python', 'Pyodide', 'Worker'],
  },
  {
    name: 'Hangman',
    image: '/assets/images/coming-soon.png',
    path: '/games/hangman',
    description: 'A classic Python word game adapted into an interactive React shell.',
    tags: ['Python', 'Interop', 'Terminal UI'],
  },
  {
    name: 'Next Game Slot',
    image: '/assets/images/coming-soon.png',
    path: '',
    description: 'Reserved for the next game module, leaderboard, or multiplayer experiment.',
    tags: ['Roadmap'],
    disabled: true,
  },
];

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

export default function Home() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr auto' },
          gap: { xs: 3, lg: 5 },
          alignItems: 'end',
          mb: 4,
        }}
      >
        <Box>
          <Chip label="React + TypeScript + browser Python" color="primary" variant="outlined" sx={{ mb: 2 }} />
          <Typography variant="h2" sx={{ maxWidth: 820, mb: 2 }}>
            Arcade Stack
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.7 }}>
            A polished mini-game platform that demonstrates React architecture, reusable game shells,
            local scoring, API fallback handling, and Python execution inside the browser.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip label="5 playable games" color="secondary" />
          <Chip label="Lazy routes" variant="outlined" />
          <Chip label="Pyodide worker" variant="outlined" />
        </Stack>
      </Box>

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
            whileHover={game.disabled ? undefined : { translateY: -6 }}
            transition={{ duration: 0.2 }}
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 420,
              borderRadius: 2,
              border: '1px solid rgba(24, 33, 64, 0.1)',
              overflow: 'hidden',
              opacity: game.disabled ? 0.72 : 1,
              backgroundColor: 'background.paper',
              boxShadow: '0 18px 45px rgba(31, 24, 64, 0.08)',
            }}
          >
            <CardMedia
              component="img"
              image={game.image}
              alt={`${game.name} cover`}
              height="190"
              loading="lazy"
              sx={{ objectFit: 'cover', backgroundColor: 'rgba(24,33,64,0.04)' }}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {game.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, mb: 2 }}>
                {game.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {game.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                fullWidth
                variant={game.disabled ? 'outlined' : 'contained'}
                disabled={game.disabled}
                component={game.disabled ? 'button' : Link}
                to={game.disabled ? undefined : game.path}
              >
                {game.disabled ? 'Coming Soon' : 'Play'}
              </Button>
            </CardActions>
          </MotionCard>
        ))}
      </Box>
    </Box>
  );
}
