import { Box, Button, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import GamePageShell from '../../components/GamePageShell';
import { usePlayer } from '../../hooks/usePlayer';

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

const getBotMove = (board: Mark[]) => {
  const available = board.map((value, index) => (value ? null : index)).filter((value): value is number => value !== null);

  const findMove = (mark: 'X' | 'O') => {
    for (const index of available) {
      const next = board.map((value, i) => (i === index ? mark : value));
      if (getWinner(next) === mark) return index;
    }
    return null;
  };

  return findMove('O') ?? findMove('X') ?? (board[4] ? null : 4) ?? available[0] ?? null;
};

export default function TicTacToe() {
  const { recordGameResult } = usePlayer();
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [resultRecorded, setResultRecorded] = useState(false);
  const winner = useMemo(() => getWinner(board), [board]);
  const isDraw = !winner && board.every(Boolean);

  useEffect(() => {
    if (resultRecorded || (!winner && !isDraw)) return;

    if (winner === 'X') {
      recordGameResult({ gameId: 'tic-tac-toe', outcome: 'win', xp: 60 });
    } else if (winner === 'O') {
      recordGameResult({ gameId: 'tic-tac-toe', outcome: 'loss', xp: 15 });
    } else {
      recordGameResult({ gameId: 'tic-tac-toe', outcome: 'draw', xp: 30 });
    }
    setResultRecorded(true);
  }, [isDraw, recordGameResult, resultRecorded, winner]);

  const play = (index: number) => {
    if (board[index] || winner) return;

    const withPlayerMove = board.map((value, i) => (i === index ? 'X' : value));
    if (getWinner(withPlayerMove) || withPlayerMove.every(Boolean)) {
      setBoard(withPlayerMove);
      return;
    }

    const botMove = getBotMove(withPlayerMove);
    setBoard(withPlayerMove.map((value, i) => (i === botMove ? 'O' : value)));
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setResultRecorded(false);
  };

  return (
    <GamePageShell
      title="Tic Tac Toe"
      description="Play X against a bot that blocks wins, takes center, and finishes obvious lines."
      tags={['Bot opponent', 'Derived state', 'Win detection']}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {winner ? `${winner === 'X' ? 'You' : 'Bot'} win${winner === 'X' ? '' : 's'}` : isDraw ? 'Draw game' : 'Your move'}
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
