import { Alert, Box, Button, Chip, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useMemo, useState } from 'react';
import GamePageShell from '../../components/GamePageShell';
import { usePlayer } from '../../hooks/usePlayer';

type SemanticWord = {
  word: string;
  family: string;
  vector: Record<string, number>;
};

type TargetWord = SemanticWord & {
  starter: string;
};

type GuessResult = {
  word: string;
  rank: number;
  closeness: number;
};

const lexicon: SemanticWord[] = [
  { word: 'ocean', family: 'nature', vector: { water: 1, nature: 0.9, travel: 0.4, depth: 0.8 } },
  { word: 'river', family: 'nature', vector: { water: 0.9, nature: 0.8, travel: 0.3, motion: 0.6 } },
  { word: 'island', family: 'nature', vector: { water: 0.6, nature: 0.7, travel: 0.8, solitude: 0.6 } },
  { word: 'forest', family: 'nature', vector: { nature: 1, green: 0.9, quiet: 0.6, depth: 0.4 } },
  { word: 'mountain', family: 'nature', vector: { nature: 0.9, height: 1, travel: 0.5, cold: 0.4 } },
  { word: 'garden', family: 'nature', vector: { nature: 0.7, green: 0.8, home: 0.5, quiet: 0.5 } },
  { word: 'python', family: 'technology', vector: { code: 1, language: 0.9, data: 0.7, automation: 0.7 } },
  { word: 'react', family: 'technology', vector: { code: 0.9, interface: 1, component: 1, web: 0.8 } },
  { word: 'database', family: 'technology', vector: { data: 1, storage: 1, query: 0.9, backend: 0.7 } },
  { word: 'algorithm', family: 'technology', vector: { code: 0.8, logic: 1, math: 0.8, automation: 0.4 } },
  { word: 'server', family: 'technology', vector: { backend: 1, web: 0.7, network: 0.8, storage: 0.3 } },
  { word: 'robot', family: 'technology', vector: { automation: 1, machine: 0.9, code: 0.5, motion: 0.7 } },
  { word: 'piano', family: 'music', vector: { music: 1, sound: 0.8, art: 0.5, practice: 0.5 } },
  { word: 'guitar', family: 'music', vector: { music: 1, sound: 0.8, art: 0.5, strings: 1 } },
  { word: 'concert', family: 'music', vector: { music: 0.9, crowd: 0.8, sound: 0.8, event: 1 } },
  { word: 'rhythm', family: 'music', vector: { music: 0.8, sound: 0.5, motion: 0.8, pattern: 0.9 } },
  { word: 'chess', family: 'games', vector: { game: 1, logic: 0.9, strategy: 1, board: 0.8 } },
  { word: 'arcade', family: 'games', vector: { game: 1, score: 0.8, machine: 0.6, fun: 0.8 } },
  { word: 'puzzle', family: 'games', vector: { game: 0.7, logic: 0.9, pattern: 0.8, challenge: 0.8 } },
  { word: 'battle', family: 'games', vector: { game: 0.6, strategy: 0.8, conflict: 1, action: 0.7 } },
  { word: 'coffee', family: 'daily', vector: { drink: 1, morning: 0.8, energy: 0.8, routine: 0.6 } },
  { word: 'library', family: 'daily', vector: { book: 1, quiet: 0.8, knowledge: 0.9, place: 0.7 } },
  { word: 'kitchen', family: 'daily', vector: { food: 0.9, home: 1, routine: 0.6, place: 0.8 } },
  { word: 'market', family: 'daily', vector: { food: 0.5, place: 0.8, crowd: 0.6, trade: 0.9 } },
];

const targets: TargetWord[] = [
  { ...lexicon.find((item) => item.word === 'ocean')!, starter: 'Think broadly: places, forces, objects, and activities can all be near it.' },
  { ...lexicon.find((item) => item.word === 'python')!, starter: 'This one lives close to automation, data, and code.' },
  { ...lexicon.find((item) => item.word === 'chess')!, starter: 'Try words around play, logic, boards, and strategy.' },
  { ...lexicon.find((item) => item.word === 'piano')!, starter: 'Start with sound, practice, art, and instruments.' },
  { ...lexicon.find((item) => item.word === 'library')!, starter: 'This target is near quiet places, learning, and collections.' },
];

const pickTarget = () => targets[Math.floor(Math.random() * targets.length)];

const cosine = (a: Record<string, number>, b: Record<string, number>) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0;
  let aMag = 0;
  let bMag = 0;
  keys.forEach((key) => {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    dot += av * bv;
    aMag += av * av;
    bMag += bv * bv;
  });
  return dot / (Math.sqrt(aMag) * Math.sqrt(bMag) || 1);
};

const inferVector = (word: string) => {
  const known = lexicon.find((item) => item.word === word);
  if (known) return known.vector;

  const related = lexicon.find((item) => item.word.includes(word) || word.includes(item.word));
  if (related) return related.vector;

  return {
    unknown: 0.6,
    length: Math.min(1, word.length / 10),
    vowel: (word.match(/[aeiou]/g)?.length ?? 0) / Math.max(1, word.length),
  };
};

const scoreGuess = (guess: string, target: TargetWord): GuessResult => {
  if (guess === target.word) return { word: guess, rank: 1, closeness: 1 };

  const rankedWords = lexicon
    .map((item) => ({ word: item.word, closeness: cosine(item.vector, target.vector) }))
    .sort((a, b) => b.closeness - a.closeness);

  const knownRank = rankedWords.findIndex((item) => item.word === guess);
  if (knownRank >= 0) {
    return {
      word: guess,
      rank: knownRank + 1,
      closeness: rankedWords[knownRank].closeness,
    };
  }

  const closeness = cosine(inferVector(guess), target.vector) * 0.62;
  const rank = rankedWords.filter((item) => item.closeness > closeness).length + 1;
  return { word: guess, rank: Math.max(rank, 8), closeness };
};

const getHeatColor = (rank: number) => {
  if (rank === 1) return 'success.main';
  if (rank <= 3) return 'secondary.main';
  if (rank <= 8) return 'warning.main';
  return 'text.secondary';
};

export default function ContextClimb() {
  const { recordGameResult } = usePlayer();
  const [target, setTarget] = useState(pickTarget);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const solved = guesses.some((item) => item.rank === 1);
  const bestGuess = guesses.reduce<GuessResult | null>((best, item) => (!best || item.rank < best.rank ? item : best), null);

  const sortedGuesses = useMemo(() => [...guesses].sort((a, b) => a.rank - b.rank), [guesses]);

  const submit = () => {
    const cleaned = guess.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!cleaned || solved || guesses.some((item) => item.word === cleaned)) return;

    const result = scoreGuess(cleaned, target);
    const nextGuesses = [...guesses, result];
    setGuesses(nextGuesses);
    setGuess('');

    if (result.rank === 1) {
      recordGameResult({
        gameId: 'context-climb',
        outcome: 'win',
        xp: Math.max(60, 160 - nextGuesses.length * 8),
        metadata: { guesses: nextGuesses.length },
      });
    }
  };

  const reset = () => {
    setTarget(pickTarget());
    setGuess('');
    setGuesses([]);
  };

  return (
    <GamePageShell
      title="Context Climb"
      description="Guess the hidden word by reading semantic rank feedback. Lower rank means closer to the target."
      tags={['Semantic rank', 'Word vectors', 'Closeness loop']}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' }, gap: 3 }}>
        <Box>
          <Alert severity={solved ? 'success' : 'info'} sx={{ mb: 2 }}>
            {solved ? `Solved in ${guesses.length} guesses.` : target.starter}
          </Alert>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label={`${guesses.length} guesses`} color="primary" />
            <Chip label={bestGuess ? `Best rank: #${bestGuess.rank}` : 'No rank yet'} color="secondary" variant="outlined" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              fullWidth
              label="Enter a related word"
              value={guess}
              disabled={solved}
              helperText="Try broad concepts first, then narrow toward the best ranks."
              onChange={(event) => setGuess(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
            />
            <Button variant="contained" onClick={submit} disabled={!guess || solved} sx={{ minWidth: 132 }}>
              Guess
            </Button>
          </Stack>
          <Button variant="outlined" onClick={reset} sx={{ mt: 2 }}>
            New Word
          </Button>
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, md: 2.5 },
            bgcolor: 'rgba(255,255,255,0.035)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Closeness Board
          </Typography>
          <Stack spacing={1.25}>
            {sortedGuesses.length ? sortedGuesses.map((item) => (
              <Box key={item.word}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                    {item.word}
                  </Typography>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`#${item.rank}`}
                    size="small"
                    sx={{ color: getHeatColor(item.rank), borderColor: getHeatColor(item.rank) }}
                    variant="outlined"
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(6, item.closeness * 100)}
                  sx={{ height: 8, borderRadius: 999 }}
                />
              </Box>
            )) : (
              <Typography variant="body2" color="text.secondary">
                Your guesses will appear here, sorted by closest rank.
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </GamePageShell>
  );
}
