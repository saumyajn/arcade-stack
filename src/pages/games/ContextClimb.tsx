import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useEffect, useMemo, useRef, useState } from 'react';
import GamePageShell from '../../components/GamePageShell';
import { usePlayer } from '../../hooks/usePlayer';

type SemanticWord = {
  word: string;
  family: string;
  vector: Record<string, number>;
};

type TargetWord = SemanticWord & {
  starter: string;
  hints: string[];
};

type GuessResult = {
  word: string;
  rank: number;
  closeness: number;
  status: string;
};

type RelatedWord = {
  word: string;
  score: number;
  rank: number;
};

type SemanticModel = {
  related: RelatedWord[];
  lookup: Map<string, RelatedWord>;
  source: 'api' | 'fallback';
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
  { word: 'doctor', family: 'health', vector: { health: 1, care: 0.9, science: 0.4, person: 0.7 } },
  { word: 'hospital', family: 'health', vector: { health: 1, care: 0.9, place: 0.8, science: 0.4 } },
  { word: 'teacher', family: 'learning', vector: { knowledge: 0.9, school: 1, person: 0.8, language: 0.4 } },
  { word: 'money', family: 'commerce', vector: { trade: 1, value: 1, work: 0.5, city: 0.3 } },
  { word: 'bank', family: 'commerce', vector: { trade: 0.8, value: 0.9, place: 0.5, city: 0.5 } },
  { word: 'chair', family: 'objects', vector: { object: 1, home: 0.7, comfort: 0.7, place: 0.3 } },
  { word: 'table', family: 'objects', vector: { object: 1, home: 0.8, food: 0.4, place: 0.3 } },
  { word: 'car', family: 'travel', vector: { travel: 0.9, machine: 0.8, city: 0.5, motion: 0.8 } },
  { word: 'train', family: 'travel', vector: { travel: 1, machine: 0.7, city: 0.7, motion: 0.8 } },
  { word: 'moon', family: 'space', vector: { sky: 1, night: 1, space: 1, quiet: 0.4 } },
  { word: 'star', family: 'space', vector: { sky: 1, night: 0.9, space: 1, light: 0.8 } },
  { word: 'dog', family: 'animals', vector: { animal: 1, home: 0.6, person: 0.4, motion: 0.4 } },
  { word: 'cat', family: 'animals', vector: { animal: 1, home: 0.7, quiet: 0.5, motion: 0.2 } },
  { word: 'soccer', family: 'sports', vector: { sport: 1, game: 0.8, motion: 0.8, crowd: 0.6 } },
  { word: 'tennis', family: 'sports', vector: { sport: 1, game: 0.8, motion: 0.7, challenge: 0.5 } },
  { word: 'city', family: 'places', vector: { city: 1, place: 0.9, crowd: 0.6, trade: 0.5 } },
  { word: 'village', family: 'places', vector: { place: 0.9, home: 0.7, quiet: 0.6, nature: 0.4 } },
  { word: 'happy', family: 'emotion', vector: { emotion: 1, fun: 0.8, light: 0.4, energy: 0.6 } },
  { word: 'sad', family: 'emotion', vector: { emotion: 1, quiet: 0.7, depth: 0.3, night: 0.3 } },
];

const targets: TargetWord[] = [
  {
    ...lexicon.find((item) => item.word === 'ocean')!,
    starter: 'Think broadly: places, forces, objects, and activities can all be near it.',
    hints: [
      'The target belongs to the nature family.',
      'Water-related words should move you closer.',
      'Try thinking about large places, depth, waves, or travel.',
      'One close neighbor is river.',
      'The answer starts with O and has 5 letters.',
    ],
  },
  {
    ...lexicon.find((item) => item.word === 'python')!,
    starter: 'This one lives close to automation, data, and code.',
    hints: [
      'The target belongs to the technology family.',
      'Programming and data words should rank better.',
      'Try language, script, automation, or backend-adjacent guesses.',
      'One close neighbor is algorithm.',
      'The answer starts with P and has 6 letters.',
    ],
  },
  {
    ...lexicon.find((item) => item.word === 'chess')!,
    starter: 'Try words around play, logic, boards, and strategy.',
    hints: [
      'The target belongs to the games family.',
      'Strategy and board words should move you closer.',
      'Try logic, puzzle, battle, or competition-adjacent guesses.',
      'One close neighbor is puzzle.',
      'The answer starts with C and has 5 letters.',
    ],
  },
  {
    ...lexicon.find((item) => item.word === 'piano')!,
    starter: 'Start with sound, practice, art, and instruments.',
    hints: [
      'The target belongs to the music family.',
      'Sound and instrument words should rank better.',
      'Try rhythm, concert, guitar, or performance-adjacent guesses.',
      'One close neighbor is guitar.',
      'The answer starts with P and has 5 letters.',
    ],
  },
  {
    ...lexicon.find((item) => item.word === 'library')!,
    starter: 'This target is near quiet places, learning, and collections.',
    hints: [
      'The target belongs to the daily/learning area.',
      'Knowledge and quiet-place words should move you closer.',
      'Try book, teacher, school, study, or place-adjacent guesses.',
      'One close neighbor is teacher.',
      'The answer starts with L and has 7 letters.',
    ],
  },
];

const pickTarget = () => targets[Math.floor(Math.random() * targets.length)];

const seededValue = (word: string, key: string) => {
  let hash = 2166136261;
  const source = `${word}:${key}`;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
};

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

const getStatus = (rank: number) => {
  if (rank === 1) return 'Solved';
  if (rank <= 10) return 'Burning';
  if (rank <= 35) return 'Very close';
  if (rank <= 90) return 'Close';
  if (rank <= 180) return 'Warm';
  if (rank <= 350) return 'Searching';
  if (rank <= 650) return 'Cold';
  return 'Distant';
};

const scoreToRank = (score: number, guess: string) => {
  const normalized = Math.max(0, Math.min(1, score));
  const jitter = Math.floor(seededValue(guess, 'rank-jitter') * 13);
  return Math.max(2, Math.min(999, Math.round(2 + (1 - normalized) ** 2.15 * 980 + jitter)));
};

const cleanWord = (word: string) => word.trim().toLowerCase().replace(/[^a-z]/g, '');

const toSemanticModel = (items: Array<{ word: string; score?: number }>, source: SemanticModel['source']): SemanticModel => {
  const filtered = items
    .map((item) => ({ word: cleanWord(item.word), score: Number(item.score) || 1 }))
    .filter((item) => item.word.length > 1);
  const maxScore = Math.max(...filtered.map((item) => item.score), 1);
  const related = filtered.map((item, index) => ({
    word: item.word,
    score: item.score / maxScore,
    rank: index + 2,
  }));

  return {
    related,
    lookup: new Map(related.map((item) => [item.word, item])),
    source,
  };
};

const fetchRelatedWords = async (word: string, max = 1000) => {
  const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=${max}`);
  if (!response.ok) throw new Error(`Datamuse failed with ${response.status}`);
  return response.json() as Promise<Array<{ word: string; score?: number }>>;
};

const buildFallbackModel = (target: TargetWord) => {
  const related = lexicon
    .filter((item) => item.word !== target.word)
    .map((item) => ({ word: item.word, score: cosine(item.vector, target.vector) * 1000 }))
    .sort((a, b) => b.score - a.score);
  return toSemanticModel(related, 'fallback');
};

const buildSemanticModel = async (target: TargetWord) => {
  try {
    const data = await fetchRelatedWords(target.word, 1000);
    const filtered = data.filter((item) => cleanWord(item.word) !== target.word);
    if (filtered.length < 50) throw new Error('Semantic model returned too few words');
    return toSemanticModel(filtered, 'api');
  } catch (error) {
    console.error('Semantic model failed:', error);
    return buildFallbackModel(target);
  }
};

const scoreGuess = async (
  guess: string,
  target: TargetWord,
  model: SemanticModel,
  guessCache: Map<string, Array<{ word: string; score?: number }>>
): Promise<GuessResult> => {
  if (guess === target.word) return { word: guess, rank: 1, closeness: 1, status: 'Solved' };

  const directMatch = model.lookup.get(guess);
  if (directMatch) {
    return {
      word: guess,
      rank: directMatch.rank,
      closeness: directMatch.score,
      status: getStatus(directMatch.rank),
    };
  }

  try {
    let guessRelated = guessCache.get(guess);
    if (!guessRelated) {
      guessRelated = await fetchRelatedWords(guess, 300);
      guessCache.set(guess, guessRelated);
    }

    const targetMatchIndex = guessRelated.findIndex((item) => cleanWord(item.word) === target.word);
    if (targetMatchIndex >= 0) {
      const score = Math.max(0.08, 0.72 - targetMatchIndex / 420);
      const rank = scoreToRank(score, guess);
      return { word: guess, rank, closeness: score, status: getStatus(rank) };
    }

    const overlapScore = guessRelated.reduce((score, item, index) => {
      const modelItem = model.lookup.get(cleanWord(item.word));
      if (!modelItem) return score;
      return score + modelItem.score * (1 / (index + 8));
    }, 0);
    const closeness = Math.max(0.02, Math.min(0.68, overlapScore));
    const rank = scoreToRank(closeness, guess);
    return { word: guess, rank, closeness, status: getStatus(rank) };
  } catch {
    const score = seededValue(`${guess}:${target.word}`, 'fallback-score') * 0.42;
    const rank = scoreToRank(score, guess);
    return { word: guess, rank, closeness: score, status: getStatus(rank) };
  }
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
  const [semanticModel, setSemanticModel] = useState<SemanticModel>(() => buildFallbackModel(target));
  const [modelLoading, setModelLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const guessCache = useRef(new Map<string, Array<{ word: string; score?: number }>>());
  const solved = guesses.some((item) => item.rank === 1);
  const wrongGuesses = guesses.filter((item) => item.rank !== 1).length;
  const bestGuess = guesses.reduce<GuessResult | null>((best, item) => (!best || item.rank < best.rank ? item : best), null);

  const sortedGuesses = useMemo(() => [...guesses].sort((a, b) => a.rank - b.rank), [guesses]);
  const hintIndex = Math.min(Math.floor(wrongGuesses / 5) - 1, target.hints.length - 1);
  const activeHint = hintIndex >= 0 ? target.hints[hintIndex] : target.starter;
  const guessesTowardNextHint = wrongGuesses % 5;
  const nextHintIn = guessesTowardNextHint === 0 ? 5 : 5 - guessesTowardNextHint;
  const hasMoreHints = hintIndex < target.hints.length - 1;

  useEffect(() => {
    let cancelled = false;
    setModelLoading(true);
    guessCache.current.clear();
    buildSemanticModel(target)
      .then((model) => {
        if (!cancelled) setSemanticModel(model);
      })
      .finally(() => {
        if (!cancelled) setModelLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [target]);

  const submit = async () => {
    const cleaned = cleanWord(guess);
    if (!cleaned || solved || modelLoading || submitting || guesses.some((item) => item.word === cleaned)) return;

    setSubmitting(true);
    const result = await scoreGuess(cleaned, target, semanticModel, guessCache.current);
    const nextGuesses = [...guesses, result];
    setGuesses(nextGuesses);
    setGuess('');
    setSubmitting(false);

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
            {solved ? `Solved in ${guesses.length} guesses.` : activeHint}
          </Alert>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label={`${guesses.length} guesses`} color="primary" />
            <Chip label={`${wrongGuesses} wrong`} variant="outlined" />
            {!solved && hasMoreHints && (
              <Chip label={wrongGuesses < 5 ? 'Hint unlocks at 5 wrong guesses' : `Next hint in ${nextHintIn}`} variant="outlined" />
            )}
            <Chip label={semanticModel.source === 'api' ? 'Large vocabulary' : 'Offline fallback'} variant="outlined" />
            <Chip label={bestGuess ? `Best rank: #${bestGuess.rank}` : 'No rank yet'} color="secondary" variant="outlined" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              fullWidth
              label="Enter a related word"
              value={guess}
              disabled={solved || modelLoading || submitting}
              helperText={modelLoading ? 'Loading semantic ranking model...' : 'Try broad concepts first, then narrow toward the best ranks.'}
              onChange={(event) => setGuess(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
            />
            <Button variant="contained" onClick={submit} disabled={!guess || solved || modelLoading || submitting} sx={{ minWidth: 132 }}>
              {submitting ? 'Ranking' : 'Guess'}
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
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Chip label={item.status} size="small" variant="outlined" />
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`#${item.rank}`}
                      size="small"
                      sx={{ color: getHeatColor(item.rank), borderColor: getHeatColor(item.rank) }}
                      variant="outlined"
                    />
                  </Stack>
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
