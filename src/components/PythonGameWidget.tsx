import { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Paper, Container, TextField } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import usePython from '../hooks/usePython';

interface PythonGameWidgetProps {
  title: string;
  description: string;
  scriptPath: string;
}

export default function PythonGameWidget({ title, description, scriptPath }: PythonGameWidgetProps) {
  const { isReady, runScript } = usePython();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // New States for Interactive Input
  const [gameStarted, setGameStarted] = useState(false);
  const [command, setCommand] = useState("");

  useEffect(() => {
    fetch(scriptPath)
      .then(res => {
          if (!res.ok) throw new Error("Could not fetch the script.");
          return res.text();
      })
      .then(text => setCode(text))
      .catch((err) => setError(`Failed to load ${scriptPath}: ${err.message}`));
  }, [scriptPath]);

  const handleRun = async (isStart: boolean) => {
    if (!isReady || !code) return;
    setIsRunning(true);
    setError(null);

    const currentCmd = isStart ? "" : command;

    if (isStart) {
      setOutput(""); // Clear output for a new game
      setGameStarted(true);
    } else {
      // Append what the user just typed into the terminal
      setOutput(prev => prev + `\n> ${currentCmd}\n\n`);
    }

    setCommand(""); // Clear input box

    try {
      // Pass isStart as the 'reset' flag to reset the python 'step' variable
      const result = await runScript(code, currentCmd, isStart);
      if (result) {
        setOutput(prev => prev + (result as string));
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 6 }}>
      <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {description}
        </Typography>
        
        <Button 
          variant={gameStarted ? "outlined" : "contained"} 
          size="large"
          color="primary"
          onClick={() => handleRun(true)}
          disabled={!isReady || !code || isRunning}
          startIcon={(!isReady || isRunning) ? <CircularProgress size={24} color="inherit" /> : (gameStarted ? <RestartAltIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />)}
          sx={{ width: '100%', py: 2, fontSize: '1.1rem', fontWeight: 'bold', mb: 4, borderRadius: 2 }}
        >
          {isRunning ? 'Running...' : isReady ? (gameStarted ? `Restart ${title}` : `Start ${title}`) : 'Initializing Python Engine...'}
        </Button>

        {/* Terminal Output */}
        {(output || error) && (
          <Box 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              fontFamily: 'monospace', 
              whiteSpace: 'pre-wrap',
              bgcolor: error ? 'error.dark' : 'white.default',
              color: error ? 'error.contrastText' : 'success.main',
              border: 1,
              borderColor: error ? 'error.main' : 'grey.800',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            {error && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'error.light' }}>
                <ErrorOutlineIcon /> <Typography fontWeight="bold">Execution Error</Typography>
              </Box>
            )}
            {output}
          </Box>
        )}

        {/* Interactive Text Input Box (Only shows when game is active) */}
        {gameStarted && !error && (
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <TextField 
                    fullWidth
                    variant="outlined"
                    placeholder="Type your command..."
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRun(false)}
                    disabled={isRunning}
                    autoComplete="off"
                />
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleRun(false)}
                    disabled={isRunning || !command.trim()}
                    endIcon={<SendIcon />}
                    sx={{ px: 4, fontWeight: 'bold' }}
                >
                    Send
                </Button>
            </Box>
        )}

      </Paper>
    </Container>
  );
}