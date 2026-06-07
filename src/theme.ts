import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6',
      dark: '#5b21b6',
      light: '#ddd6fe',
    },
    secondary: {
      main: '#2dd4bf',
      dark: '#0f766e',
      light: '#ccfbf1',
    },
    warning: {
      main: '#fbbf24',
    },
    background: {
      default: '#0f172a',
      paper: '#151c2f',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    divider: 'rgba(255,255,255,0.12)',
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h1: { fontFamily: `'Baloo 2', cursive`, fontWeight: 800, letterSpacing: 0 },
    h2: { fontFamily: `'Baloo 2', cursive`, fontWeight: 800, letterSpacing: 0 },
    h3: { fontFamily: `'Baloo 2', cursive`, fontWeight: 800, letterSpacing: 0 },
    h4: { fontWeight: 800, letterSpacing: 0 },
    h5: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: 0 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 42,
          borderRadius: 999,
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});
