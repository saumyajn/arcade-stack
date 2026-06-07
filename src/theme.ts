import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5b3fd6',
      dark: '#39259c',
      light: '#ebe7ff',
    },
    secondary: {
      main: '#0f9f8f',
      dark: '#0b6f65',
      light: '#d7f8f3',
    },
    warning: {
      main: '#f59e0b',
    },
    background: {
      default: '#f6f3ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#17122f',
      secondary: '#625f77',
    },
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
  },
});
