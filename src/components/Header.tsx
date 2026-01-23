import React, { useState } from 'react';
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
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // State
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Desktop Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const gamesMenuOpen = Boolean(anchorEl);

  // Mobile Menu State (Separated for better UX)
  const [mobileGamesOpen, setMobileGamesOpen] = useState(false);

  // Handlers
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
    if (!open) setMobileGamesOpen(false); // Reset mobile menu on close
  };

  const handleGamesClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGamesClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
    setMobileGamesOpen(false);
    handleGamesClose();
  };

  return (
    <AppBar 
      position="sticky" 
      color="primary" 
      elevation={0}
      sx={{ 
        // UI Polish: Glassmorphism effect
        backdropFilter: 'blur(10px)', 
        background: 'rgba(205, 180, 219, 0.9)' // semi-transparent primary
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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
            
            {/* Optimized Desktop Games Menu */}
            <Button
              color="inherit"
              onClick={handleGamesClick}
              endIcon={gamesMenuOpen ? <ExpandLess /> : <ExpandMore />}
              aria-controls={gamesMenuOpen ? 'games-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={gamesMenuOpen ? 'true' : undefined}
            >
              Games
            </Button>
            <Menu
              id="games-menu"
              anchorEl={anchorEl}
              open={gamesMenuOpen}
              onClose={handleGamesClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1.5, borderRadius: 2, minWidth: 180 }
              }}
            >
              <MenuItem onClick={() => navigateTo('/games/rock-paper-scissors')}>Rock Paper Scissors</MenuItem>
              <MenuItem onClick={() => navigateTo('/games/battleship')}>Battleship</MenuItem>
              <MenuItem onClick={() => navigateTo('/games/unscramble')}>Word Scramble</MenuItem>
            </Menu>

            <Button color="inherit" onClick={() => navigateTo('/about')}>About</Button>
          </Box>
        ) : (
          /* Right: Mobile Nav */
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
                  <ListItem onClick={() => navigateTo('/')} sx={{ cursor: 'pointer' }}>
                    <ListItemText primary="Home" />
                  </ListItem>

                  <ListItem onClick={() => setMobileGamesOpen(!mobileGamesOpen)} sx={{ cursor: 'pointer' }}>
                    <ListItemText primary="Games" />
                    {mobileGamesOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>

                  <Collapse in={mobileGamesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem sx={{ pl: 4, cursor: 'pointer' }} onClick={() => navigateTo('/games/rock-paper-scissors')}>
                        <ListItemText primary="Rock Paper Scissors" />
                      </ListItem>
                      <ListItem sx={{ pl: 4, cursor: 'pointer' }} onClick={() => navigateTo('/games/battleship')}>
                        <ListItemText primary="Battleship" />
                      </ListItem>
                      <ListItem sx={{ pl: 4, cursor: 'pointer' }} onClick={() => navigateTo('/games/unscramble')}>
                        <ListItemText primary="Word Scramble" />
                      </ListItem>
                    </List>
                  </Collapse>

                  <Divider />

                  <ListItem onClick={() => navigateTo('/about')} sx={{ cursor: 'pointer' }}>
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

export default Header;