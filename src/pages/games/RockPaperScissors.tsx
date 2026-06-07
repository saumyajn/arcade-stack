import { Box, Button, Paper, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useEffect, useState } from 'react';
import GamePageShell from '../../components/GamePageShell';

const choices = ['rock', 'paper', 'scissor'];

const getRandomChoice = () => choices[Math.floor(Math.random() * choices.length)];

const MotionButton = motion(Button);

export default function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState('');
  const [compChoice, setCompChoice] = useState('');
  const [winner, setWinner] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (userScore === 10) {
      setShowConfetti(true);
    }
  }, [userScore]);

  const play = (choice: string) => {
    const computer = getRandomChoice();
    setUserChoice(choice);
    setCompChoice(computer);

    if (choice === computer) {
      setWinner("It's a tie!");
    } else if (
      (choice === 'rock' && computer === 'scissor') ||
      (choice === 'scissor' && computer === 'paper') ||
      (choice === 'paper' && computer === 'rock')
    ) {
      setWinner('You win!');
      setUserScore((prev) => prev + 1);
    } else {
      setWinner('Computer wins!');
      setCompScore((prev) => prev + 1);
    }
  };

  const reset = () => {
    setUserChoice('');
    setCompChoice('');
    setWinner('');
    setUserScore(0);
    setCompScore(0);
    setShowConfetti(false);
  };

  return (
    <GamePageShell
      title="Rock Paper Scissors"
      description="Pick a move, race the CPU, and use the score state to track a lightweight best-of session."
      tags={['State logic', 'Score tracking', 'Motion feedback']}
    >
    <Box textAlign="center">
      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
      )}

      <Typography variant="body1" color="text.secondary" mb={3}>
        Make your move and test your luck.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
        {choices.map((choice) => (
          <MotionButton
            key={choice}
            aria-label={`Choose ${choice}`}
            variant="contained"
            color="primary"
            onClick={() => play(choice)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
          >
            {choice.toUpperCase()}
          </MotionButton>
        ))}
      </Box>

      <AnimatePresence>
        {userChoice && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
          >
            <Box mt={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid rgba(24,33,64,0.1)' }}>
                <Typography variant="h6">
                  You: <strong>{userChoice.toUpperCase()}</strong>
                </Typography>
                <Typography variant="h6">
                  Computer: <strong>{compChoice.toUpperCase()}</strong>
                </Typography>
                <Typography variant="h5" mt={2}>
                  {winner}
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Box mt={4}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Typography variant="body2">
            Score - You: {userScore} | Computer: {compScore}
          </Typography>
        </motion.div>

        <Button variant="outlined" color="secondary" onClick={reset} sx={{ mt: 2 }}>
          Reset
        </Button>
      </Box>
    </Box>
    </GamePageShell>
  );
}
