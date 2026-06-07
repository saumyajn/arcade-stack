import { Box, Button, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import GamePageShell from '../../components/GamePageShell';

type Mark = 'X' | 'O' | null;

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Mark[]) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const winner = useMemo(() => getWinner(board), [board]);
  const isDraw = !winner && board.every(Boolean);

  const play = (index: number) => {
    if (board[index] || winner) return;
    setBoard((current) => current.map((value, i) => (i === index ? turn : value)));
    setTurn((current) => (current === 'X' ? 'O' : 'X'));
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
  };

  return (
    <GamePageShell
      title="Tic Tac Toe"
      description="A compact board game showing turn state, derived winner calculation, and reset flow."
      tags={['Board logic', 'Derived state', 'Win detection']}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {winner ? `${winner} wins` : isDraw ? 'Draw game' : `${turn}'s turn`}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(72px, 108px))',
            justifyContent: 'center',
            gap: 1.5,
            mb: 3,
          }}
        >
          {board.map((value, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => play(index)}
              disabled={Boolean(value) || Boolean(winner)}
              sx={{
                aspectRatio: '1',
                fontSize: '2rem',
                fontWeight: 900,
                borderColor: 'divider',
                bgcolor: value ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              }}
            >
              {value}
            </Button>
          ))}
        </Box>
        <Button variant="contained" onClick={reset}>
          Reset Board
        </Button>
      </Box>
    </GamePageShell>
  );
}
