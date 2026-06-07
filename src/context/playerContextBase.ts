import { createContext } from 'react';
import type { PlayerContextValue } from './playerTypes';

export const PlayerContext = createContext<PlayerContextValue | null>(null);
