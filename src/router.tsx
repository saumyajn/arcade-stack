import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
// Lazy load the pages
const Home = lazy(() => import('./pages/Home'));
const RockPaperScissors = lazy(() => import('./pages/games/RockPaperScissors'));
const Battleship = lazy(() => import('./pages/games/Battleship'));
const WordScramble = lazy(() => import('./pages/games/WordScramble'));
const About = lazy(() => import('./components/About'));
const TreasureIsland = lazy(() => import('./pages/games/TreasureIsland'));
const PythonHangman = lazy(() => import('./pages/games/PythonHangman'));
const TicTacToe = lazy(() => import('./pages/games/TicTacToe'));
const MemoryMatch = lazy(() => import('./pages/games/MemoryMatch'));
const NumberGuess = lazy(() => import('./pages/games/NumberGuess'));
const ContextClimb = lazy(() => import('./pages/games/ContextClimb'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
import { Box, CircularProgress } from '@mui/material';

const PageLoader = () => (
    <Box display="flex" justifyContent="center" minHeight="50vh">
        <CircularProgress />
    </Box>
)
const AppRouter = () => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100%">
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
                    <Route path="/games/battleship" element={<Battleship />} />
                    <Route path="/games/unscramble" element={<WordScramble />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/games/treasure-island" element={<TreasureIsland />} />
                    <Route path="/games/hangman" element={<PythonHangman />} />
                    <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
                    <Route path="/games/memory-match" element={<MemoryMatch />} />
                    <Route path="/games/number-guess" element={<NumberGuess />} />
                    <Route path="/games/context-climb" element={<ContextClimb />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </Box >
    );
};

export default AppRouter;
