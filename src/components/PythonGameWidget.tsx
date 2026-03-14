import { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Paper, Container } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import usePython from '../hooks/usePython';

interface PythonGameWidgetProps {
  title: string;
  description: string;
  scriptPath: string;
}

export default function PythonGameWidget({ title, description, scriptPath }: PythonGameWidgetProps) {
  const { isReady, runScript } = usePython();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetch(scriptPath)
      .then(res => {
          if (!res.ok) throw new Error("Could not fetch the script.");
          return res.text();
      })
      .then(text => setCode(text))
      .catch((err) => setError(`Failed to load ${scriptPath}: ${err.message}`));
  }, [scriptPath]);

  const handleRun = async () => {
    if (!isReady || !code) return;
    setIsRunning(true);
    setError(null);
    setOutput(null);
    try {
      const result = await runScript(code);
      setOutput(result as string);
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
          variant="contained" 
          size="large"
          color="primary"
          onClick={handleRun}
          disabled={!isReady || !code || isRunning}
          startIcon={(!isReady || isRunning) ? <CircularProgress size={24} color="inherit" /> : <PlayArrowIcon fontSize="large" />}
          sx={{ width: '100%', py: 2, fontSize: '1.1rem', fontWeight: 'bold', mb: 4, borderRadius: 2 }}
        >
          {isRunning ? 'Running Game...' : isReady ? `Start ${title}` : 'Initializing Python Engine...'}
        </Button>

        {(output || error) && (
          <Box 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              fontFamily: 'monospace', 
              whiteSpace: 'pre-wrap',
              bgcolor: error ? 'error.dark' : 'grey.900',
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
            {error || output}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
