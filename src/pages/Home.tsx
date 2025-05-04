import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const games = [
  {
    name: 'Rock Paper Scissors',
    image: '/assets/images/rps-cover.png',
    path: '/games/rock-paper-scissors',
    description: 'The classic hand battle. Rock, paper, or scissors?',
    disabled: false,
  },
  {
    name: 'Battleship',
    image: '/assets/images/battleship.gif',
    path: '/games/battleship',
    description: 'Sink your opponent’s fleet before they sink yours!',
    disabled: false,
  },
  {
    name: 'Word Scramble',
    image: '/assets/images/scramble-cover.png',
    path: '/games/unscramble',
    description: 'Unscramble the letters before time runs out!',
    disabled: false,
  },
  {
    name: 'Coming Soon',
    image: '/assets/images/coming-soon.png',
    path: '',
    description: 'More games are on the way. Stay tuned!',
    disabled: true,
  },
];

const MotionCard = motion(Card);

const Home = () => {
  return (
    <Box textAlign="center" sx={{ py: 6, px: 2 }}>
      {/* Hero Section */}
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          fontFamily: `'Baloo 2', cursive`,
          fontWeight: 600,
          color: 'primary.main',
        }}
      >
        🎮 Welcome to ArcadeStack!
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 5 }}>
        A growing collection of quick, fun games you can play anywhere. Challenge yourself and have fun!
      </Typography>

      {/* Game Grid */}
      <Grid container spacing={4} justifyContent="center">
        {games.map((game, index) => (
          <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <MotionCard
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              elevation={4}
              sx={{
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: game.disabled ? '#f1f1f1' : 'white',
              }}
            >
              <CardMedia
                component="img"
                image={game.image}
                alt={game.name}
                height="180"
                sx={{ objectFit: 'contain' }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: `'Baloo 2', cursive` }}
                  gutterBottom
                >
                  {game.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto', pb: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={game.disabled}
                  component={game.disabled ? 'button' : Link}
                  to={game.path}
                >
                  {game.disabled ? 'Coming Soon' : 'Play Now'}
                </Button>
              </CardActions>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;