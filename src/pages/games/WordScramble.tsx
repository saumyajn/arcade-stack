import {
    Box,
    Typography,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
    IconButton,
    Alert,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import { useState } from "react";
  
  export default function WordScramble() {
    const [difficulty, setDifficulty] = useState("0");
    const [originalWord, setOriginalWord] = useState("");
    const [shuffledWord, setShuffledWord] = useState("");
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");
    const [tryAgain, setTryAgain] = useState(false);
    const [lastResult, setLastResult] = useState("");
    const [attempts, setAttempts] = useState(0);
  
    const shuffle = (word: string) =>
      word.split("").sort(() => Math.random() - 0.5).join("");
  
    const getRandomWord = async () => {
      let length = 5;
      switch (difficulty) {
        case "1": length = 5; break;
        case "2": length = 7; break;
        case "3": length = 9; break;
        default: length = Math.floor(Math.random() * 5) + 5; break;
      }
  
      const pattern = "?".repeat(length);
      const url = `https://api.datamuse.com/words?sp=${pattern}&max=20`;
  
      try {
        const res = await fetch(url);
        const data = await res.json();
        const valid = data.filter((d: any) => /^[a-z]+$/.test(d.word));
        const word = valid[Math.floor(Math.random() * valid.length)].word;
  
        setOriginalWord(word);
        setShuffledWord(shuffle(word));
        setGuess("");
        setTryAgain(false);
        setMessage("");
        setAttempts(0);
      } catch (error) {
        console.error("Datamuse failed:", error);
        setMessage("❌ Couldn't load a word. Please try again.");
      }
    };
  
    const checkWord = () => {
      const cleanedGuess = guess.trim().toLowerCase();
      const cleanedOriginal = originalWord.toLowerCase();
  
      if (cleanedGuess === cleanedOriginal) {
        setMessage("🎉 Correct!");
        setLastResult(`✅ ${originalWord}`);
        setOriginalWord("");
        setShuffledWord("");
        setGuess("");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setTryAgain(true);
  
        if (newAttempts >= 5) {
          setMessage(`❌ 5 tries used! The correct word was: ${originalWord}`);
          setLastResult(`❌ ${originalWord}`);
          setOriginalWord("");
          setShuffledWord("");
          setGuess("");
        } else {
          setMessage("❌ Try again! You have " +(5- newAttempts) +"  attempts remaining");
        }
      }
    };
  
    const resetGame = () => {
      setOriginalWord("");
      setShuffledWord("");
      setGuess("");
      setMessage("");
      setTryAgain(false);
      setLastResult("");
      setAttempts(0);
    };
  
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, px: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Word Scramble!
        </Typography>
  
        <Box textAlign="center" mb={3}>
          <Typography>Select a difficulty and generate a word</Typography>
          <ToggleButtonGroup
            color="primary"
            value={difficulty}
            exclusive
            onChange={(_, value) => value && setDifficulty(value)}
            sx={{ my: 2 }}
          >
            <ToggleButton value="1">Easy</ToggleButton>
            <ToggleButton value="2">Medium</ToggleButton>
            <ToggleButton value="3">Difficult</ToggleButton>
            <ToggleButton value="0">Any</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <Button variant="outlined" color="secondary" onClick={getRandomWord}>
            Generate Word
          </Button>
        </Box>
  
        {message && (
          <Alert severity={tryAgain ? "error" : "success"} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
  
        {lastResult && (
          <Typography variant="subtitle1" align="center" color="success.main" mb={2}>
            Last word was: <strong>{lastResult}</strong>
          </Typography>
        )}
  
        {shuffledWord && (
          <Box textAlign="center" mt={2}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
              <TextField
                label="Your Guess"
                variant="outlined"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkWord()}
                InputProps={{
                  endAdornment: guess && (
                    <IconButton onClick={() => setGuess("")}> <CloseIcon /> </IconButton>
                  ),
                }}
              />
              <Button variant="contained" onClick={checkWord}>
                Check
              </Button>
              <Button variant="outlined" color="error" onClick={resetGame}>
                Reset
              </Button>
              <Button variant="outlined" color="primary" onClick={getRandomWord}>
                Next Word
              </Button>
            </Box>
  
            <Box mt={3} display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
              {shuffledWord.split("").map((char, i) => (
                <Box
                  key={i}
                  sx={{
                    fontSize: 24,
                    border: "1px solid #ccc",
                    padding: "8px 12px",
                    borderRadius: 1,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {char}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  }
  