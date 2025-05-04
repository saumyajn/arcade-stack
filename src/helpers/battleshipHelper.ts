// hooks/useBattleshipGame.ts
import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 10;

const ships = [
  { id: 'carrier', size: 5 },
  { id: 'battleship', size: 4 },
  { id: 'cruiser', size: 3 },
  { id: 'submarine', size: 3 },
  { id: 'destroyer', size: 2 },
];

type Orientation = 'horizontal' | 'vertical';

type ShipPlacement = {
  id: string;
  x: number;
  y: number;
  orientation: Orientation;
};

type Attack = {
  x: number;
  y: number;
  hit: boolean;
};

export default function useBattleshipGame() {
  const [placedShips, setPlacedShips] = useState<ShipPlacement[]>([]);
  const [cpuShips, setCpuShips] = useState<ShipPlacement[]>([]);
  const [shipOrientation, setShipOrientation] = useState<Orientation>('horizontal');
  const [draggingShip, setDraggingShip] = useState<{
    id: string;
    size: number;
    orientation: Orientation;
  } | null>(null);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [cpuAttacks, setCpuAttacks] = useState<Attack[]>([]);
  const [targetQueue, setTargetQueue] = useState<{ x: number; y: number }[]>([]);
  const [smartHits, setSmartHits] = useState<{ x: number; y: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [youWin, setYouWin] = useState(false);

  const fitsOnBoard = useCallback((x: number, y: number, size: number, orientation: Orientation) => {
    return orientation === 'horizontal'
      ? x + size <= GRID_SIZE
      : y + size <= GRID_SIZE;
  }, []);

  const overlapsExisting = useCallback((
    x: number,
    y: number,
    ship: { size: number; orientation: Orientation; id: string },
    board: ShipPlacement[]
  ) => {
    const newCells = Array.from({ length: ship.size }).map((_, i) =>
      ship.orientation === 'horizontal'
        ? `${x + i}-${y}`
        : `${x}-${y + i}`
    );

    const existingCells = board.flatMap((s) => {
      const size = ships.find((ship) => ship.id === s.id)!.size;
      return Array.from({ length: size }).map((_, i) =>
        s.orientation === 'horizontal'
          ? `${s.x + i}-${s.y}`
          : `${s.x}-${s.y + i}`
      );
    });

    return newCells.some((cell) => existingCells.includes(cell));
  }, []);

  const isOccupied = useCallback((x: number, y: number, board: ShipPlacement[]) => {
    return board.some((ship) => {
      const size = ships.find((s) => s.id === ship.id)!.size;
      if (ship.orientation === 'horizontal') {
        return y === ship.y && x >= ship.x && x < ship.x + size;
      } else {
        return x === ship.x && y >= ship.y && y < ship.y + size;
      }
    });
  }, []);

  const randomizeShips = useCallback((): ShipPlacement[] => {
    const placed: ShipPlacement[] = [];

    for (let ship of ships) {
      let valid = false;
      let attempt = 0;

      while (!valid && attempt < 100) {
        const orientation: Orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const maxX = orientation === 'horizontal' ? GRID_SIZE - ship.size : GRID_SIZE - 1;
        const maxY = orientation === 'vertical' ? GRID_SIZE - ship.size : GRID_SIZE - 1;

        const x = Math.floor(Math.random() * (maxX + 1));
        const y = Math.floor(Math.random() * (maxY + 1));

        const overlaps = overlapsExisting(x, y, { ...ship, orientation }, placed);

        if (!overlaps) {
          placed.push({ id: ship.id, x, y, orientation });
          valid = true;
        }
        attempt++;
      }
    }

    return placed;
  }, [overlapsExisting]);

  useEffect(() => {
    if (placedShips.length === ships.length && cpuShips.length === 0) {
      const placed = randomizeShips();
      setCpuShips(placed);
    }
  }, [placedShips, cpuShips, randomizeShips]);

  const toggleOrientation = () => {
    setShipOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'));
  };

  const handleDrop = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    if (!draggingShip) return;
    const fits = fitsOnBoard(x, y, draggingShip.size, draggingShip.orientation);
    const overlaps = overlapsExisting(x, y, draggingShip, placedShips);
    if (!fits || overlaps) return;

    setPlacedShips((prev) => [
      ...prev,
      { id: draggingShip.id, x, y, orientation: draggingShip.orientation },
    ]);
  };

  const handleAttack = (x: number, y: number) => {
    if (gameOver || attacks.find((a) => a.x === x && a.y === y)) return;

    const hit = isOccupied(x, y, cpuShips);
    const newAttacks = [...attacks, { x, y, hit }];
    setAttacks(newAttacks);

    const totalHits = newAttacks.filter((a) => a.hit).length;
    const totalShipCells = cpuShips.reduce(
      (sum, ship) => sum + ships.find((s) => s.id === ship.id)!.size,
      0
    );

    if (totalHits >= totalShipCells) {
      setGameOver(true);
      setYouWin(true);
      return;
    }

    setTimeout(() => handleCpuTurn(newAttacks, cpuAttacks, placedShips), 1000);
  };

  const handleCpuTurn = (
    prevAttacks: Attack[],
    prevCpuAttacks: Attack[],
    playerShips: ShipPlacement[]
  ) => {
    if (gameOver) return;

    let x: number, y: number;
    const tried = new Set(prevCpuAttacks.map((a) => `${a.x}-${a.y}`));
    let target = null;

    while (targetQueue.length) {
      const next = targetQueue.shift()!;
      const key = `${next.x}-${next.y}`;
      if (!tried.has(key) && next.x >= 0 && next.x < GRID_SIZE && next.y >= 0 && next.y < GRID_SIZE) {
        target = next;
        break;
      }
    }

    if (!target) {
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
      } while (tried.has(`${x}-${y}`));
    } else {
      x = target.x;
      y = target.y;
    }

    const hit = isOccupied(x, y, playerShips);
    const newCpuAttacks = [...prevCpuAttacks, { x, y, hit }];
    setCpuAttacks(newCpuAttacks);

    if (hit) {
      const updatedHits = [...smartHits, { x, y }];
      setSmartHits(updatedHits);

      let newTargets: { x: number; y: number }[] = [];
      if (updatedHits.length >= 2) {
        const [a, b] = updatedHits.slice(-2);
        const orientation = a.x === b.x ? 'vertical' : 'horizontal';

        if (orientation === 'horizontal') {
          const sameRow = updatedHits.filter(pt => pt.y === a.y).sort((a, b) => a.x - b.x);
          const minX = sameRow[0].x;
          const maxX = sameRow[sameRow.length - 1].x;
          newTargets = [
            { x: minX - 1, y: a.y },
            { x: maxX + 1, y: a.y }
          ];
        } else {
          const sameCol = updatedHits.filter(pt => pt.x === a.x).sort((a, b) => a.y - b.y);
          const minY = sameCol[0].y;
          const maxY = sameCol[sameCol.length - 1].y;
          newTargets = [
            { x: a.x, y: minY - 1 },
            { x: a.x, y: maxY + 1 }
          ];
        }
      } else {
        newTargets = [
          { x: x + 1, y },
          { x: x - 1, y },
          { x, y: y + 1 },
          { x, y: y - 1 },
        ];
      }

      setTargetQueue((prev) => [...prev, ...newTargets]);
    } else {
      // reset smartHits if we miss
      setSmartHits([]);
    }

    const totalHits = newCpuAttacks.filter((a) => a.hit).length;
    const totalShipCells = playerShips.reduce(
      (sum, ship) => sum + ships.find((s) => s.id === ship.id)!.size,
      0
    );

    if (totalHits >= totalShipCells) {
      setGameOver(true);
      setYouWin(false);
    }
  };

  return {
    placedShips,
    setPlacedShips,
    cpuShips,
    shipOrientation,
    draggingShip,
    attacks,
    cpuAttacks,
    gameOver,
    youWin,
    toggleOrientation,
    setDraggingShip,
    handleDrop,
    handleAttack,
  };
}