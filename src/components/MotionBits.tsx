import { Box, Paper, Typography, type BoxProps } from '@mui/material';
import { keyframes } from '@emotion/react';
import type { ReactNode } from 'react';

const shine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

type ShinyTextProps = BoxProps & {
  children: ReactNode;
};

export function ShinyText({ children, sx, ...props }: ShinyTextProps) {
  return (
    <Box
      component="span"
      sx={{
        backgroundImage:
          'linear-gradient(110deg, #f8fafc 0%, #c4b5fd 28%, #99f6e4 48%, #f8fafc 68%)',
        backgroundSize: '200% auto',
        color: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        animation: `${shine} 6s ease-in-out infinite`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

type NeonPanelProps = BoxProps & {
  glow?: 'primary' | 'secondary' | 'warning';
};

const glowMap = {
  primary: 'rgba(139,92,246,0.24)',
  secondary: 'rgba(45,212,191,0.2)',
  warning: 'rgba(251,191,36,0.18)',
};

export function NeonPanel({ children, glow = 'primary', sx, ...props }: NeonPanelProps) {
  return (
    <Box
      component={Paper}
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.14)',
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))',
        boxShadow: `0 18px 55px ${glowMap[glow]}`,
        backdropFilter: 'blur(14px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(120deg, rgba(255,255,255,0.2), transparent 18%, transparent 78%, rgba(255,255,255,0.12))',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

type StatTileProps = {
  label: string;
  value: string;
  tone?: 'primary' | 'secondary' | 'warning';
};

export function StatTile({ label, value, tone = 'primary' }: StatTileProps) {
  const color = tone === 'secondary' ? 'secondary.main' : tone === 'warning' ? 'warning.main' : 'primary.main';

  return (
    <NeonPanel glow={tone} sx={{ p: 2, minWidth: 150 }}>
      <Typography variant="h4" sx={{ color, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>
        {label}
      </Typography>
    </NeonPanel>
  );
}
