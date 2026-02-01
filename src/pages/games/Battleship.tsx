import React from 'react';
import { Box, Typography, Grid, Button, Paper, Alert, Stack } from '@mui/material';
import useBattleshipGame, { ships,  } from '../../helpers/battleshipHelper';
// import { useHighScore } from '../../hooks/useHighScore'; // Uncomment if hook is created

const GRID_SIZE = 10;

// Optimized Cell Component to prevent re-renders
const GridCell = React.memo(({ 
  type, status, onClick, onDrop, onDragOver 
}: { 
  x: number, y: number, type: 'player' | 'enemy', 
  status: 'empty' | 'ship' | 'hit' | 'miss', 
  onClick?: () => void, 
  onDrop?: (e: React.DragEvent) => void,
  onDragOver?: (e: React.DragEvent) => void
}) => {
  
  let bg = '#e3f2fd'; // Default water
  let content = '';

  if (status === 'ship') bg = '#66b8fc'; // Ship placed
  if (status === 'hit') { bg = '#ef5350'; content = '💥'; }
  if (status === 'miss') { bg = '#bdbdbd'; content = '🌊'; }

  return (
    <Box
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      sx={{
        width: 32,
        height: 32,
        backgroundColor: bg,
        border: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: type === 'enemy' && status === 'empty' ? 'crosshair' : 'default',
        fontSize: '1.2rem',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: type === 'enemy' && status === 'empty' ? '#bbdefb' : bg
        }
      }}
    >
      {content}
    </Box>
  );
});

const Battleship = () => {
  const {
    gameState,
    placedShips,
    setPlacedShips,
    shipOrientation,
    toggleOrientation,
    setDraggingShip,
    handleDrop,
    handleAttack,
    attacks,
    cpuAttacks,
    winner,
    startGame,
    resetGame
  } = useBattleshipGame();

  // const highScore = useHighScore('battleship', winner === 'player' ? 100 : 0); // Example usage

  // --- Helper to calculate cell status for rendering ---
  const getCellStatus = (x: number, y: number, isPlayerBoard: boolean): 'empty' | 'ship' | 'hit' | 'miss' => {
    if (isPlayerBoard) {
      const attack = cpuAttacks.find(a => a.x === x && a.y === y);
      const hasShip = placedShips.some(ship => {
        const size = ships.find(s => s.id === ship.id)?.size || 0;
        return ship.orientation === 'horizontal' 
          ? y === ship.y && x >= ship.x && x < ship.x + size
          : x === ship.x && y >= ship.y && y < ship.y + size;
      });

      if (attack) return attack.hit ? 'hit' : 'miss';
      if (hasShip) return 'ship';
      return 'empty';
    } else {
      // Enemy Board
      const attack = attacks.find(a => a.x === x && a.y === y);
      if (attack) return attack.hit ? 'hit' : 'miss';
      return 'empty';
    }
  };

  return (
    <Box textAlign="center" sx={{ py: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Baloo 2' }}>
        Battleship
      </Typography>

      {/* Game Over Banner */}
      {gameState === 'gameOver' && (
        <Alert 
          severity={winner === 'player' ? 'success' : 'error'} 
          sx={{ mb: 3, justifyContent: 'center' }}
        >
          <Typography variant="h6">
            {winner === 'player' ? '🎉 Victory! You sank the enemy fleet!' : '💀 Defeat! Your fleet is destroyed.'}
          </Typography>
        </Alert>
      )}

      {/* Control Panel */}
      <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
        {gameState === 'placing' ? (
          <>
            <Button variant="contained" onClick={startGame} disabled={placedShips.length !== 5}>
              Start Battle
            </Button>
            <Button variant="outlined" onClick={toggleOrientation}>
              Rotate: {shipOrientation.toUpperCase()}
            </Button>
            <Button color="error" onClick={() => setPlacedShips([])}>Clear Board</Button>
          </>
        ) : (
          <Button variant="contained" color="warning" onClick={resetGame}>
            Reset Game
          </Button>
        )}
      </Stack>

      {/* Ship Dock (Only during placement) */}
      {gameState === 'placing' && (
        <Paper sx={{ p: 2, mb: 4, bgcolor: '#f5f5f5', display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Typography width="100%" variant="subtitle2" color="textSecondary">Drag ships to your board</Typography>
          {ships.map((ship) => {
            const isPlaced = placedShips.some(s => s.id === ship.id);
            if (isPlaced) return null;

            return (
              <Box
                key={ship.id}
                draggable
                onDragStart={() => setDraggingShip({ ...ship, orientation: shipOrientation })}
                sx={{
                  width: shipOrientation === 'horizontal' ? ship.size * 32 : 32,
                  height: shipOrientation === 'horizontal' ? 32 : ship.size * 32,
                  bgcolor: '#90caf9',
                  border: '1px solid #1976d2',
                  cursor: 'grab',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}
              >
                {ship.id.slice(0, 2).toUpperCase()}
              </Box>
            );
          })}
        </Paper>
      )}

      {/* Boards Grid */}
      <Grid container spacing={4} justifyContent="center">
        {/* Player Board */}
        <Grid>
          <Typography variant="h6" gutterBottom color="primary">Your Fleet</Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 32px)`, 
            gap: 0, 
            border: '2px solid #333' 
          }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              return (
                <GridCell
                  key={`player-${i}`}
                  x={x} y={y}
                  type="player"
                  status={getCellStatus(x, y, true)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, x, y)}
                />
              );
            })}
          </Box>
        </Grid>

        {/* Enemy Board */}
        <Grid>
          <Typography variant="h6" gutterBottom color="error">Enemy Waters</Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 32px)`, 
            gap: 0, 
            border: '2px solid #333',
            opacity: gameState === 'placing' ? 0.5 : 1,
            pointerEvents: gameState === 'placing' || gameState === 'gameOver' ? 'none' : 'auto'
          }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              return (
                <GridCell
                  key={`enemy-${i}`}
                  x={x} y={y}
                  type="enemy"
                  status={getCellStatus(x, y, false)}
                  onClick={() => handleAttack(x, y)}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Battleship;