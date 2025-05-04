import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
    if (!open) setGamesOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
    setGamesOpen(false);
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
  <img src="/game.ico" height="30" style={{ margin: '10px' }} alt="Home" />
</Link>
          <Typography
            variant="h6"
            fontWeight={600}
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            ArcadeStack
          </Typography>
        </Box>

        {/* Right: Desktop Nav */}
        {!isMobile ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => navigateTo('/')}>Home</Button>
            <Button
              color="inherit"
              onClick={() => setGamesOpen(!gamesOpen)}
              endIcon={gamesOpen ? <ExpandLess /> : <ExpandMore />}
            >
              Games
            </Button>
            <MenuDropdown open={gamesOpen} onClose={() => setGamesOpen(false)} navigateTo={navigateTo} />
            <Button color="inherit" onClick={() => navigateTo('/about')}>About</Button>
          </Box>
        ) : (
          <>
            <IconButton
              edge="end"
              color="inherit"
              size="large"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box sx={{ width: 250 }} role="presentation">
                <List>
                  <ListItem onClick={() => navigateTo('/')}>
                    <ListItemText primary="Home" />
                  </ListItem>

                  <ListItem onClick={() => setGamesOpen(!gamesOpen)}>
                    <ListItemText primary="Games" />
                    {gamesOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>

                  <Collapse in={gamesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem sx={{ pl: 4 }} onClick={() => navigateTo('/games/rock-paper-scissors')}>
                        <ListItemText primary="Rock Paper Scissors" />
                      </ListItem>
                      <ListItem sx={{ pl: 4 }} onClick={() => navigateTo('/games/battleship')}>
                        <ListItemText primary="Battleship" />
                      </ListItem>
                      <ListItem sx={{ pl: 4 }} onClick={() => navigateTo('/games/unscramble')}>
                        <ListItemText primary="Word Scramble" />
                      </ListItem>
                    </List>
                  </Collapse>

                  <Divider />

                  <ListItem onClick={() => navigateTo('/about')}>
                    <ListItemText primary="About" />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const MenuDropdown = ({
  open,

  navigateTo,
}: {
  open: boolean;
  onClose: () => void;
  navigateTo: (path: string) => void;
}) => {
  if (!open) return null;
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 64,
        background: 'white',
        boxShadow: 3,
        borderRadius: 1,
        zIndex: 10,
      }}
    >
      <List dense>
        <ListItem onClick={() => navigateTo('/games/rock-paper-scissors')}>
          <ListItemText primary="Rock Paper Scissors" />
        </ListItem>
        <ListItem onClick={() => navigateTo('/games/battleship')}>
          <ListItemText primary="Battleship" />
        </ListItem>
        <ListItem onClick={() => navigateTo('/games/unscramble')}>
          <ListItemText primary="Word Scramble" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Header;
