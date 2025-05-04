// import React from 'react';
import { CssBaseline, ThemeProvider, Container } from '@mui/material';

import AppRouter from './router';
import Header from './components/Header';
import { theme } from './theme';
import PuzzleBackground from './components/PuzzleBg';
import Footer from './components/Footer';


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container sx={{ mt: 4 }}>
      <PuzzleBackground />
        <AppRouter />
      </Container>
      <Footer/>
    </ThemeProvider>
  );
};

export default App;
