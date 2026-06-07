import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import React from 'react';

const scan = keyframes`
  0% { transform: translate3d(-12%, -12%, 0); }
  100% { transform: translate3d(12%, 12%, 0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 0.82; transform: scale(1.08); }
`;

const PuzzleBackground = () => {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: -2,
        overflow: 'hidden',
        pointerEvents: 'none',
        background:
          'radial-gradient(circle at 18% 18%, rgba(139,92,246,0.22), transparent 30%), radial-gradient(circle at 82% 10%, rgba(45,212,191,0.16), transparent 26%), linear-gradient(135deg, #0f172a, #111827 56%, #0b1120)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '-18%',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          opacity: 0.42,
          animation: `${scan} 18s linear infinite alternate`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(139,92,246,0.2), transparent 18%), radial-gradient(circle at 72% 70%, rgba(45,212,191,0.14), transparent 20%)',
          backgroundSize: 'auto',
          animation: `${pulse} 7s ease-in-out infinite`,
        },
        '@media (prefers-reduced-motion: reduce)': {
          '&::before, &::after': {
            animation: 'none',
          },
        },
      }}
    />
  );
};

export default React.memo(PuzzleBackground);
