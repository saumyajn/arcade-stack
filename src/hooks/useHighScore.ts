import { useState, useEffect } from 'react';

export function useHighScore(gameKey: string, currentScore: number) {
  const [highScore, setHighScore] = useState(0);

  // Load on mount
  useEffect(() => {
    const stored = localStorage.getItem(`highscore_${gameKey}`);
    if (stored) setHighScore(parseInt(stored, 10));
  }, [gameKey]);

  // Update if current score beats high score
  useEffect(() => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem(`highscore_${gameKey}`, currentScore.toString());
    }
  }, [currentScore, highScore, gameKey]);

  return highScore;
}