import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import ExtensionIcon from '@mui/icons-material/Extension';
import React, { useMemo } from "react";

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
  50% { transform: translateY(-20px) rotate(15deg); opacity: 0.3; }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
`;
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PuzzlePiece = ({ delay, duration, top, left, size, color }: any) => (
  <Box
    sx={{
      position: 'absolute',
      top,
      left,
      fontSize: `${size}px`,
      color,
      opacity: 0.1,
      animation: `${float} ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    <ExtensionIcon fontSize="inherit" />
  </Box>
)
const PuzzleBackground=()=> {

  const pieces = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: 20 + Math.random() * 20,
      color: getRandomColor(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 5 // Random start times
    }));
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {pieces.map((p) => (
        <PuzzlePiece key={p.id} {...p} /> 
      ))}
    </Box>
  );
}
export default React.memo(PuzzleBackground);