// Battleship.tsx
import { Box, Typography, Grid, Button, Paper } from '@mui/material';
import useBattleshipGame from '../../helpers/battleshipHelper';

const ships = [
  { id: 'carrier', size: 5 },
  { id: 'battleship', size: 4 },
  { id: 'cruiser', size: 3 },
  { id: 'submarine', size: 3 },
  { id: 'destroyer', size: 2 },
];

const GRID_SIZE = 10;

const Battleship = () => {
  const {
    placedShips,
    setPlacedShips,
    shipOrientation,
    attacks,
    cpuAttacks,
    gameOver,
    youWin,
    toggleOrientation,
    setDraggingShip,
    handleDrop,
    handleAttack,
  } = useBattleshipGame();

  return (
    <Box textAlign="center" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Battleship — Player vs CPU
      </Typography>

      <Button
        onClick={toggleOrientation}
        variant="outlined"
        size="small"
        sx={{ mb: 3 }}
      >
        Rotate Ships ({shipOrientation})
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        {ships.map((ship) => {
          const alreadyPlaced = placedShips.find((s: any) => s.id === ship.id);
          if (alreadyPlaced) return null;

          return (
            <Paper
              key={ship.id}
              draggable
              onDragStart={() =>
                setDraggingShip({ ...ship, orientation: shipOrientation })
              }
              onDoubleClick={toggleOrientation}
              onContextMenu={(e) => {
                e.preventDefault();
                toggleOrientation();
              }}
              sx={{
                width: shipOrientation === 'horizontal'
                  ? ship.size * 32 + (ship.size - 1) * 4
                  : 32,
                height: shipOrientation === 'horizontal'
                  ? 32
                  : ship.size * 32 + (ship.size - 1) * 4,
                background: '#90caf9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                cursor: 'grab',
                fontSize: 14,
                userSelect: 'none',
                writingMode: shipOrientation === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
              }}
            >
              {ship.id}
            </Paper>
          );
        })}
        {gameOver && (
          <Typography variant="h6" sx={{ mt: 2, color: youWin ? 'green' : 'red' }}>
            {youWin ? '🎉 You Win! All enemy ships sunk!' : '💥 CPU Wins! All your ships are destroyed.'}
          </Typography>
        )}
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid>
          <Typography variant="h6" gutterBottom>
            Your Board
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 32px)`,
              gap: '4px',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const occupied = placedShips.some((ship: any) => {
                const size = ships.find(s => s.id === ship.id)!.size;
                return ship.orientation === 'horizontal'
                  ? y === ship.y && x >= ship.x && x < ship.x + size
                  : x === ship.x && y >= ship.y && y < ship.y + size;
              });
              const attack = cpuAttacks.find((a: any) => a.x === x && a.y === y);
              let bg = '#e0e0e0';
              if (occupied) bg = '#42a5f5';
              if (attack) bg = attack.hit ? '#ef5350' : '#90a4ae';

              return (
                <Box
                  key={i}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, x, y)}
                  sx={{
                    width: 32,
                    height: 32,
                    background: bg,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                  }}
                />
              );
            })}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained"  sx={{ m: 2 }} color="success" disabled={placedShips.length !== 5}>
              Ready
            </Button>
            <Button sx={{ m: 2 }}
              variant="outlined"
              color="error"
              onClick={() => setPlacedShips([])}
            >
              Reset
            </Button>
          </Box>
        </Grid>

        <Grid>
          <Typography variant="h6" gutterBottom>
            Enemy Waters
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 32px)`,
              gap: '4px',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const attack = attacks.find((a: any) => a.x === x && a.y === y);
              let bg = '#e0e0e0';
              if (attack) bg = attack.hit ? '#ef5350' : '#90a4ae';

              return (
                <Box
                  key={i}
                  onClick={() => handleAttack(x, y)}
                  sx={{
                    width: 32,
                    height: 32,
                    background: bg,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    cursor: attack || gameOver ? 'default' : 'pointer',
                    transition: 'background 0.3s ease',
                  }}
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