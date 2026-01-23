import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
  } from '@mui/material';
  import { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import Confetti from 'react-confetti';
  import { useWindowSize } from 'react-use';
  
  const choices = ['rock', 'paper', 'scissor'];
  
  const getRandomChoice = () => {
    return choices[Math.floor(Math.random() * choices.length)];
  };
  
  const MotionButton = motion(Button);
  
  const RockPaperScissors = () => {
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
      <Box textAlign="center">
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={300}
            recycle={false}
          />
        )}
  
        <Typography variant="h3" mb={2}>
          ✊ Rock 🧻 Paper ✂️ Scissors
        </Typography>
  
        <Typography variant="body1" mb={3}>
          Make your move and test your luck!
        </Typography>
  
        <Grid container spacing={2} justifyContent="center">
          {choices.map((choice) => (
            <Grid  key={choice}>
              <MotionButton
              key={choice}
              aria-label={`Choose ${choice}`}
                variant="contained"
                color="primary"
                onClick={() => play(choice)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {choice.toUpperCase()}
              </MotionButton>
            </Grid>
          ))}
        </Grid>
  
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
                <Paper elevation={2} sx={{ p: 3 }}>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="body2">
              🎯 Score — You: {userScore} | Computer: {compScore}
            </Typography>
          </motion.div>
  
          <Button
            variant="outlined"
            color="secondary"
            onClick={reset}
            sx={{ mt: 2 }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    );
  };
  
  export default RockPaperScissors;
  