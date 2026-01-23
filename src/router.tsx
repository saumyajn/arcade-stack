import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
// Lazy load the pages
const Home = lazy(() => import('./pages/Home'));
const RockPaperScissors = lazy(() => import('./pages/games/RockPaperScissors'));
const Battleship = lazy(() => import('./pages/games/Battleship'));
const WordScramble = lazy(() => import('./pages/games/WordScramble'));
const About = lazy(() => import('./components/About'));
import { Box, CircularProgress } from '@mui/material';

const PageLoader = () => (
    <Box display="flex" justifyContent="center" minHeight="50vh">
        <CircularProgress />
    </Box>
)
const AppRouter = () => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
                    <Route path="/games/battleship" element={<Battleship />} />
                    <Route path="/games/unscramble" element={<WordScramble />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Suspense>
        </Box >
    );
};

export default AppRouter;
