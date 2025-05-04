import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import ExtensionIcon from '@mui/icons-material/Extension';

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
  50% { transform: translateY(-20px) rotate(15deg); opacity: 0.3; }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
`;
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const pastel = `hsl(${hue}, 70%, 80%)`;
    return pastel;
  }
export default function PuzzleBackground() {
  const pieces = Array.from({ length: 25 });

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
      {pieces.map((_, i) => {
        const size = 20 + Math.random() * 20;
        const color = getRandomColor();
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${size}px`,
              color,
              opacity: 0.1,
              animation: `${float} ${4 + Math.random() * 3}s ease-in-out infinite`,
            }}
          >
            <ExtensionIcon fontSize="inherit" />
          </Box>
        );
      })}
    </Box>
  );
}
