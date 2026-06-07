import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';

import AppRouter from './router';
import Header from './components/Header';
import { theme } from './theme';
import PuzzleBackground from './components/PuzzleBg';
import Footer from './components/Footer';
import { PlayerProvider } from './context/PlayerContext';
import XpToast from './components/XpToast';


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlayerProvider>
        <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
          <PuzzleBackground />
          <Header />
          <Container component="main" maxWidth="xl" sx={{ flex: 1, py: { xs: 2, md: 3 } }}>
            <AppRouter />
          </Container>
          <Footer />
          <XpToast />
        </Box>
      </PlayerProvider>
    </ThemeProvider>
  );
};

export default App;
