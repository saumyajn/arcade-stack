import { Box, Button, Chip, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import GamePageShell from '../../components/GamePageShell';
import { usePlayer } from '../../hooks/usePlayer';

const symbols = ['A', 'B', 'C', 'D', 'E', 'F'];

const createDeck = () =>
  [...symbols, ...symbols]
    .map((symbol, index) => ({ id: `${symbol}-${index}`, symbol, matched: false }))
    .sort(() => Math.random() - 0.5);

export default function MemoryMatch() {
  const { recordGameResult } = usePlayer();
  const [deck, setDeck] = useState(createDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [resultRecorded, setResultRecorded] = useState(false);
  const complete = useMemo(() => deck.every((card) => card.matched), [deck]);

  useEffect(() => {
    if (!complete || resultRecorded) return;

    recordGameResult({
      gameId: 'memory-match',
      outcome: 'complete',
      xp: Math.max(40, 140 - attempts * 5),
      metadata: { attempts },
    });
    setResultRecorded(true);
  }, [attempts, complete, recordGameResult, resultRecorded]);

  const reset = () => {
    setDeck(createDeck());
    setFlipped([]);
    setAttempts(0);
    setResultRecorded(false);
  };

  const flip = (index: number) => {
    if (flipped.includes(index) || deck[index].matched || flipped.length === 2) return;

    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setAttempts((current) => current + 1);
      const [first, second] = nextFlipped;
      if (deck[first].symbol === deck[second].symbol) {
        setDeck((current) =>
          current.map((card, cardIndex) =>
            cardIndex === first || cardIndex === second ? { ...card, matched: true } : card
          )
        );
        setFlipped([]);
      } else {
        window.setTimeout(() => setFlipped([]), 650);
      }
    }
  };

  return (
    <GamePageShell
      title="Memory Match"
      description="Flip cards, match pairs, and clear the deck with as few attempts as possible."
      tags={['Shuffle', 'Pair matching', 'Timed state cleanup']}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`Attempts: ${attempts}`} color="primary" />
          <Chip label={complete ? 'Complete' : 'In progress'} color={complete ? 'success' : 'secondary'} />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(3, minmax(72px, 1fr))', sm: 'repeat(4, 96px)' },
            justifyContent: 'center',
            gap: 1.5,
            mb: 3,
          }}
        >
          {deck.map((card, index) => {
            const visible = card.matched || flipped.includes(index);
            return (
              <Button
                key={card.id}
                variant={visible ? 'contained' : 'outlined'}
                onClick={() => flip(index)}
                disabled={card.matched}
                sx={{
                  aspectRatio: '1',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  borderColor: 'divider',
                  bgcolor: visible ? undefined : 'rgba(255,255,255,0.03)',
                }}
              >
                {visible ? card.symbol : ''}
              </Button>
            );
          })}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {complete ? `Solved in ${attempts} attempts.` : 'Find all matching pairs.'}
        </Typography>
        <Button variant="contained" onClick={reset}>
          Shuffle Again
        </Button>
      </Box>
    </GamePageShell>
  );
}
