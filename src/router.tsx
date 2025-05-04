import { Routes, Route } from 'react-router-dom';
import RockPaperScissors from './pages/games/RockPaperScissors';
import Battleship from './pages/games/Battleship';
import Home from './pages/Home';
import About from './components/About';
import WordScramble from './pages/games/WordScramble';
import { Box } from '@mui/material';
const AppRouter = () => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
            <Route path="/games/battleship" element={<Battleship />} />
            <Route path="/games/unscramble" element={<WordScramble />} />
            <Route path="/about" element={<About/>} />
        </Routes>
        </Box>
    );
};

export default AppRouter;
