import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  IconButton,
  Alert,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useState, useEffect } from "react";
// import { useHighScore } from '../../hooks/useHighScore';

export default function WordScramble() {
  const [difficulty, setDifficulty] = useState("0");
  const [originalWord, setOriginalWord] = useState("");
  const [shuffledWord, setShuffledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  // const highScore = useHighScore('wordscramble', score)

  const shuffle = (word: string) => {
    let shuffled = word.split("").sort(() => Math.random() - 0.5).join("");
    while (shuffled === word && word.length > 1) { shuffled = word.split("").sort(() => Math.random() - 0.5).join(""); }
    return shuffled;
  }

  const getWordLength = () => {
    switch (difficulty) {
      case "1": return 5;
      case "2": return 7;
      case "3": return 9; break;
      default: return Math.floor(Math.random() * 4) + 5;
    }
  };
  const getRandomWord = async () => {
    setLoading(true);
    setMessage(null);
    setGuess("");
    const length = getWordLength();
    const pattern = "?".repeat(length);
    const url = `https://api.datamuse.com/words?sp=${pattern}&max=100`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = data.filter((d: any) => /^[a-z]+$/.test(d.word));
      if (valid.length > 0) {
        const word = valid[Math.floor(Math.random() * valid.length)].word;
        setOriginalWord(word);
        setShuffledWord(shuffle(word));
      }
      else {
        throw new Error("No Valid words found");
      }

    } catch (error) {
      console.error("Datamuse failed:", error);
      setMessage({ type: 'error', text: 'Network Error. Using Offline fallback' });
      const fallbacks = ["react", "vite", "material", "coding", "pizza", "games", "fallback"]
      const word = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setOriginalWord(word);
      setShuffledWord(shuffle(word))
    }
    finally {
      setLoading(false)
    }
  };
  // Start game on mount
  useEffect(() => {
    if (!originalWord) getRandomWord();
  }, []);

  const checkWord = () => {
    const cleanedGuess = guess.trim().toLowerCase();
    const cleanedOriginal = originalWord.toLowerCase();

    if (cleanedGuess === cleanedOriginal) {
      const points = cleanedOriginal.length * 10;
      setMessage({ type: 'success', text: `🎉 Correct! +${points} points` });
      setScore(s => s + points);
      setStreak(s => s + 1);
      setTimeout(getRandomWord, 1500); // Auto next
    } else {
      setMessage({ type: 'error', text: "❌ Incorrect, try again!" });
      setStreak(0);
      setScore(s => Math.max(0, s - 5)); // Penalty
    }
  };
  const handleSkip = () => {
    setMessage({ type: 'info', text: `Skipped! The word was: ${originalWord}` });
    setStreak(0);
    setTimeout(getRandomWord, 1500);
  };


  return (
    <Box sx={{   mt: 6, px: 3, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ fontFamily: 'Baloo 2' }} gutterBottom>
        Word Scramble!
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Box display="flex">
          <Chip label={`Score: ${score}`} color="primary" variant="outlined" />
          <Chip label={`Streak: 🔥 ${streak}`} color={streak > 2 ? "warning" : "default"} />
        </Box>

        <Box mb={3}>
          <Typography variant="body2" color="textSecondary" gutterBottom>Select difficulty</Typography>
          <ToggleButtonGroup
            color="primary"
            value={difficulty}
            exclusive
            size="small"
            onChange={(_, value) => value && setDifficulty(value)}
            sx={{ my: 2 }}
          >
            <ToggleButton value="1">Easy (5)</ToggleButton>
            <ToggleButton value="2">Medium (7)</ToggleButton>
            <ToggleButton value="3">Difficult (9)</ToggleButton>
            <ToggleButton value="0">Random</ToggleButton>
          </ToggleButtonGroup>

        </Box>
        <Box sx={{ minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h2" sx={{ letterSpacing: 8, fontFamily: 'monospace', fontWeight: 'bold' }}>
                {shuffledWord.toUpperCase()}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Unscramble the letters above
              </Typography>
            </>
          )}
        </Box>
        <Box mt={4} display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Type your answer"
            variant="outlined"
            value={guess}
            disabled={loading}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkWord()}
            InputProps={{
              endAdornment: guess && (
                <IconButton onClick={() => setGuess("")}> <CloseIcon /> </IconButton>
              ),
            }}
          />
          <Box display="flex" gap={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={checkWord}
              disabled={loading || !guess}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleSkip}
              startIcon={<SkipNextIcon />}
            >
              Skip
            </Button>
          </Box>
        </Box>
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
      </Paper>
      <Button startIcon={<RefreshIcon />} size="small" onClick={getRandomWord}>
        Generate New Word Manually
      </Button>

    </Box>
  );
}
