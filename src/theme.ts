import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#cdb4db',
    },
    secondary: {
      main: '#84c1fa',
    },
    background: {
      default: '#fdfcff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h1: { fontFamily: `'Baloo 2', cursive` },
    h2: { fontFamily: `'Baloo 2', cursive` },
    h3: { fontFamily: `'Baloo 2', cursive` },
  },
});
