import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import GamePageShell from '../../components/GamePageShell';

const createTarget = () => Math.floor(Math.random() * 100) + 1;

export default function NumberGuess() {
  const [target, setTarget] = useState(createTarget);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<number[]>([]);
  const latest = attempts.length ? attempts[attempts.length - 1] : undefined;
  const solved = latest === target;

  const reset = () => {
    setTarget(createTarget());
    setGuess('');
    setAttempts([]);
  };

  const submit = () => {
    const value = Number(guess);
    if (!Number.isInteger(value) || value < 1 || value > 100 || solved) return;
    setAttempts((current) => [...current, value]);
    setGuess('');
  };

  const feedback = latest === undefined
    ? 'Guess a number between 1 and 100.'
    : solved
      ? `Correct. You solved it in ${attempts.length} attempts.`
      : latest < target
        ? 'Too low. Try a higher number.'
        : 'Too high. Try a lower number.';

  return (
    <GamePageShell
      title="Number Guess"
      description="Use bounded input, derived feedback, and attempt history to locate the hidden number."
      tags={['Input validation', 'Feedback loop', 'Random state']}
    >
      <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Hidden Number
        </Typography>
        <Alert severity={solved ? 'success' : 'info'} sx={{ mb: 2 }}>
          {feedback}
        </Alert>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Your guess"
            type="number"
            value={guess}
            disabled={solved}
            inputProps={{ min: 1, max: 100 }}
            onChange={(event) => setGuess(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && submit()}
          />
          <Button variant="contained" onClick={submit} disabled={!guess || solved} sx={{ minWidth: 132 }}>
            Guess
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Attempts: {attempts.length ? attempts.join(', ') : 'None yet'}
        </Typography>
        <Button variant="outlined" onClick={reset}>
          New Number
        </Button>
      </Box>
    </GamePageShell>
  );
}
