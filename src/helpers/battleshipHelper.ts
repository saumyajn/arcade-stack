import { useState, useCallback } from 'react';

const GRID_SIZE = 10;

export const ships = [
  { id: 'carrier', size: 5 },
  { id: 'battleship', size: 4 },
  { id: 'cruiser', size: 3 },
  { id: 'submarine', size: 3 },
  { id: 'destroyer', size: 2 },
];

export type Orientation = 'horizontal' | 'vertical';

export type ShipPlacement = {
  id: string;
  x: number;
  y: number;
  orientation: Orientation;
};

export type Attack = {
  x: number;
  y: number;
  hit: boolean;
};

export default function useBattleshipGame() {
  // Game State
  const [gameState, setGameState] = useState<'placing' | 'playing' | 'gameOver'>('placing');
  const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);
  
  // Board State
  const [placedShips, setPlacedShips] = useState<ShipPlacement[]>([]);
  const [cpuShips, setCpuShips] = useState<ShipPlacement[]>([]);
  const [attacks, setAttacks] = useState<Attack[]>([]); // Player's attacks on CPU
  const [cpuAttacks, setCpuAttacks] = useState<Attack[]>([]); // CPU's attacks on Player

  // Placement State
  const [shipOrientation, setShipOrientation] = useState<Orientation>('horizontal');
  const [draggingShip, setDraggingShip] = useState<{ id: string; size: number; orientation: Orientation } | null>(null);

  // AI State
  const [targetQueue, setTargetQueue] = useState<{ x: number; y: number }[]>([]);
  const [, setLastHit] = useState<{ x: number; y: number } | null>(null);

  // --- Logic Helpers ---

  const fitsOnBoard = useCallback((x: number, y: number, size: number, orientation: Orientation) => {
    return orientation === 'horizontal' ? x + size <= GRID_SIZE : y + size <= GRID_SIZE;
  }, []);

  const getShipCells = (ship: ShipPlacement) => {
    const size = ships.find((s) => s.id === ship.id)?.size || 0;
    return Array.from({ length: size }).map((_, i) => ({
      x: ship.orientation === 'horizontal' ? ship.x + i : ship.x,
      y: ship.orientation === 'horizontal' ? ship.y : ship.y + i,
    }));
  };

  const checkOverlap = useCallback((x: number, y: number, size: number, orientation: Orientation, existingShips: ShipPlacement[]) => {
    const newCells = Array.from({ length: size }).map((_, i) =>
      orientation === 'horizontal' ? `${x + i}-${y}` : `${x}-${y + i}`
    );
    
    const occupiedCells = new Set();
    existingShips.forEach(s => {
      getShipCells(s).forEach(cell => occupiedCells.add(`${cell.x}-${cell.y}`));
    });

    return newCells.some(cell => occupiedCells.has(cell));
  }, []);

  const randomizeShips = useCallback((): ShipPlacement[] => {
    const placed: ShipPlacement[] = [];
    ships.forEach((ship) => {
      let placedSuccessfully = false;
      while (!placedSuccessfully) {
        const orientation: Orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);

        if (fitsOnBoard(x, y, ship.size, orientation) && !checkOverlap(x, y, ship.size, orientation, placed)) {
          placed.push({ id: ship.id, x, y, orientation });
          placedSuccessfully = true;
        }
      }
    });
    return placed;
  }, [fitsOnBoard, checkOverlap]);

  // --- Actions ---

  const startGame = () => {
    if (placedShips.length !== 5) return;
    setCpuShips(randomizeShips());
    setGameState('playing');
  };

  const resetGame = () => {
    setPlacedShips([]);
    setCpuShips([]);
    setAttacks([]);
    setCpuAttacks([]);
    setTargetQueue([]);
    setLastHit(null);
    setGameState('placing');
    setWinner(null);
  };

  const handleDrop = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    if (!draggingShip) return;
    
    // Check if ship fits and doesn't overlap
    if (fitsOnBoard(x, y, draggingShip.size, draggingShip.orientation) && 
        !checkOverlap(x, y, draggingShip.size, draggingShip.orientation, placedShips)) {
      setPlacedShips(prev => [...prev, { id: draggingShip.id, x, y, orientation: draggingShip.orientation }]);
    }
  };

  // --- Attack Logic ---

  const checkWinCondition = (currentAttacks: Attack[], targetShips: ShipPlacement[]) => {
    const totalShipCells = targetShips.reduce((acc, ship) => acc + (ships.find(s => s.id === ship.id)?.size || 0), 0);
    const totalHits = currentAttacks.filter(a => a.hit).length;
    return totalHits === totalShipCells;
  };

  const handleAttack = (x: number, y: number) => {
    if (gameState !== 'playing' || attacks.some(a => a.x === x && a.y === y)) return;

    // Player Turn
    const isHit = cpuShips.some(ship => 
      getShipCells(ship).some(cell => cell.x === x && cell.y === y)
    );
    
    const newAttacks = [...attacks, { x, y, hit: isHit }];
    setAttacks(newAttacks);

    if (checkWinCondition(newAttacks, cpuShips)) {
      setGameState('gameOver');
      setWinner('player');
      return;
    }

    // Trigger CPU Turn
    setTimeout(() => cpuTurn(newAttacks), 500);
  };

  const cpuTurn = (newAttacks: Attack[]) => {
    console.log(newAttacks)
    // Determine target
    let x: number, y: number;
    let validMove = false;
    let safetyCounter = 0;
    
    // Existing attacks map
    const previousAttacks = new Set(cpuAttacks.map(a => `${a.x}-${a.y}`));

    while (!validMove && safetyCounter < 1000) {
      safetyCounter++;
      
      // 1. Try Target Queue from AI
      if (targetQueue.length > 0) {
        const target = targetQueue.shift()!;
        x = target.x;
        y = target.y;
      } else {
        // 2. Random Hunt
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
      }

      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && !previousAttacks.has(`${x}-${y}`)) {
        validMove = true;
      }
    }

    if (!validMove) return; // Should rarely happen

    // Check Hit
    const isHit = placedShips.some(ship => 
      getShipCells(ship).some(cell => cell.x === x && cell.y === y)
    );

    const newCpuAttacks = [...cpuAttacks, { x: x!, y: y!, hit: isHit }];
    setCpuAttacks(newCpuAttacks);

    // AI Logic Update
    if (isHit) {
      setLastHit({ x: x!, y: y! });
      // Add adjacent cells to queue
      const neighbors = [
        { x: x! + 1, y: y! }, { x: x! - 1, y: y! },
        { x: x!, y: y! + 1 }, { x: x!, y: y! - 1 }
      ];
      // Prioritize neighbors that align with previous hits if available
      setTargetQueue(prev => [...neighbors, ...prev]); 
    }

    if (checkWinCondition(newCpuAttacks, placedShips)) {
      setGameState('gameOver');
      setWinner('cpu');
    }
  };

  return {
    gameState,
    placedShips,
    setPlacedShips,
    shipOrientation,
    toggleOrientation: () => setShipOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal'),
    draggingShip,
    setDraggingShip,
    handleDrop,
    handleAttack,
    attacks,
    cpuAttacks,
    winner,
    resetGame,
    startGame,
    // Helpers for UI
    isPlayerTurn: gameState === 'playing',
  };
}