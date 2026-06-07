import { Alert, Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import GamePageShell from '../../components/GamePageShell';
import { usePlayer } from '../../hooks/usePlayer';

const wordBank = [
  { word: 'react', clues: ['component-driven', 'uses hooks', 'renders UI'] },
  { word: 'python', clues: ['script friendly', 'snake name', 'used by Pyodide'] },
  { word: 'arcade', clues: ['collection of games', 'cabinet energy', 'this app'] },
  { word: 'memory', clues: ['pairs and recall', 'cards flip', 'matching skill'] },
  { word: 'battle', clues: ['grid attack', 'ships sink', 'strategy duel'] },
  { word: 'number', clues: ['hidden target', 'higher or lower', 'bounded guess'] },
];

const pickWord = () => wordBank[Math.floor(Math.random() * wordBank.length)];

export default function WordMatch() {
  const { recordGameResult } = usePlayer();
  const [round, setRound] = useState(pickWord);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<string[]>([]);
  const solved = attempts.some((attempt) => attempt === round.word);
  const remaining = Math.max(0, 5 - attempts.length);
  const clueIndex = Math.min(attempts.length, round.clues.length - 1);
  const lastAttempt = attempts.length ? attempts[attempts.length - 1] : undefined;

  const feedback = useMemo(() => {
    if (!attempts.length) return 'The bot picked a secret word. Use the clues to match it.';
    if (solved) return `Correct. The word was ${round.word}.`;
    if (!remaining) return `Out of attempts. The word was ${round.word}.`;
    return lastAttempt?.length === round.word.length
      ? 'Same length, different word.'
      : 'Different length. Use the next clue.';
  }, [attempts.length, lastAttempt?.length, remaining, round.word, solved]);

  const submit = () => {
    const cleaned = guess.trim().toLowerCase();
    if (!cleaned || solved || !remaining) return;
    const nextAttempts = [...attempts, cleaned];
    if (cleaned === round.word) {
      recordGameResult({
        gameId: 'word-match',
        outcome: 'win',
        xp: Math.max(40, 110 - nextAttempts.length * 12),
        metadata: { attempts: nextAttempts.length, wordLength: round.word.length },
      });
    } else if (nextAttempts.length === 5) {
      recordGameResult({
        gameId: 'word-match',
        outcome: 'loss',
        xp: 15,
        metadata: { attempts: nextAttempts.length, wordLength: round.word.length },
      });
    }
    setAttempts(nextAttempts);
    setGuess('');
  };

  const reset = () => {
    setRound(pickWord());
    setGuess('');
    setAttempts([]);
  };

  return (
    <GamePageShell
      title="Word Match"
      description="Guess the bot's secret word from progressive clues before your attempts run out."
      tags={['Bot word', 'Clue reveal', 'Attempts']}
    >
      <Box sx={{ maxWidth: 640, mx: 'auto', textAlign: 'center' }}>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label={`Attempts left: ${remaining}`} color={remaining ? 'secondary' : 'error'} />
          <Chip label={`Word length: ${round.word.length}`} variant="outlined" />
        </Stack>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Clue: {round.clues[clueIndex]}
        </Typography>
        <Alert severity={solved ? 'success' : remaining ? 'info' : 'warning'} sx={{ mb: 2 }}>
          {feedback}
        </Alert>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Secret word"
            value={guess}
            disabled={solved || !remaining}
            onChange={(event) => setGuess(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && submit()}
          />
          <Button variant="contained" onClick={submit} disabled={!guess || solved || !remaining} sx={{ minWidth: 132 }}>
            Match
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Guesses: {attempts.length ? attempts.join(', ') : 'None yet'}
        </Typography>
        <Button variant="outlined" onClick={reset}>
          New Word
        </Button>
      </Box>
    </GamePageShell>
  );
}
