import { Box, Typography, Chip, Divider, Fade } from "@mui/material";
import { useEffect, useState } from "react";

const techStack = ["React", "TypeScript", "Vite", "MUI", "Firebase"];
const games = ["Battleship", "Rock Paper Scissors", "Word Scramble"];

export default function About() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={show} timeout={600}>
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, px: 3 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          About Arcade Stack
        </Typography>

        <Typography variant="body1" paragraph>
          🎮 Arcade Stack is a growing collection of mini-games built with modern web tech.
          It’s a personal playground of fun, interactivity, and experimentation.
        </Typography>

        <Divider sx={{ my: 3 }}>
          <Chip label="Tech Stack" color="primary" />
        </Divider>

        <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
          {techStack.map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" color="secondary" />
          ))}
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip label="Available Games" color="primary" />
        </Divider>

        <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
          {games.map((game) => (
            <Chip key={game} label={game} color="success" />
          ))}
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip label="What's Next" color="primary" />
        </Divider>

        <Typography variant="body2">
          🚀 Multiplayer support, user stats, profile pages, and more mini-games are on the way!
        </Typography>

        <Divider sx={{ my: 3 }}>
          <Chip label="Made By" color="primary" />
        </Divider>

        <Typography variant="body2" textAlign="center">
          👤 Created by <strong>Saumya Jain</strong>. Built with passion and a love for games.
        </Typography>
      </Box>
    </Fade>
  );
}
