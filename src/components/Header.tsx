import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { liveGames } from '../data/games';
import PlayerStatus from './PlayerStatus';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileGamesOpen, setMobileGamesOpen] = useState(false);
  const gamesMenuOpen = Boolean(anchorEl);

  const isActive = (path: string) => location.pathname === path;
  const isGameActive = liveGames.some((game) => location.pathname === game.path);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
    if (!open) setMobileGamesOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
    setMobileGamesOpen(false);
    setAnchorEl(null);
  };

  const navButtonSx = (active: boolean) => ({
    color: active ? 'primary.main' : 'text.primary',
    bgcolor: active ? 'rgba(255,61,129,0.14)' : 'transparent',
    border: active ? '1px solid rgba(255,61,129,0.3)' : '1px solid transparent',
    '&:hover': {
      bgcolor: active ? 'rgba(255,61,129,0.18)' : 'rgba(255,255,255,0.08)',
    },
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(14px)',
        backgroundColor: 'rgba(13,11,24,0.82)',
        boxShadow: '0 18px 45px rgba(0,0,0,0.24)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
        <Box
          component={Link}
          to="/"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            minHeight: 44,
          }}
        >
          <img src="/game.ico" height="32" width="32" alt="" aria-hidden="true" />
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
            ArcadeStack
          </Typography>
        </Box>

        {!isMobile ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button sx={navButtonSx(isActive('/'))} onClick={() => navigateTo('/')}>
              Home
            </Button>
            <Button
              id="games-button"
              sx={navButtonSx(isGameActive)}
              onClick={(event) => setAnchorEl(event.currentTarget)}
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
              onClose={() => setAnchorEl(null)}
              MenuListProps={{ 'aria-labelledby': 'games-button' }}
              PaperProps={{ elevation: 0, sx: { mt: 1.5, borderRadius: 2, minWidth: 220, border: '1px solid', borderColor: 'divider' } }}
            >
              {liveGames.map((game) => (
                <MenuItem key={game.id} selected={isActive(game.path)} onClick={() => navigateTo(game.path)}>
                  {game.name}
                </MenuItem>
              ))}
            </Menu>
            <Button sx={navButtonSx(isActive('/about'))} onClick={() => navigateTo('/about')}>
              About
            </Button>
            <Button sx={navButtonSx(isActive('/profile'))} onClick={() => navigateTo('/profile')}>
              Profile
            </Button>
            <PlayerStatus />
          </Box>
        ) : (
          <>
            <IconButton color="primary" size="large" aria-label="Open navigation menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box sx={{ width: 300, py: 1 }} role="presentation">
                <List>
                  <ListItemButton selected={isActive('/')} onClick={() => navigateTo('/')}>
                    <ListItemText primary="Home" />
                  </ListItemButton>

                  <ListItemButton selected={isGameActive} onClick={() => setMobileGamesOpen((open) => !open)}>
                    <ListItemText primary="Games" />
                    {mobileGamesOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse in={mobileGamesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {liveGames.map((game) => (
                        <ListItemButton
                          key={game.id}
                          selected={isActive(game.path)}
                          sx={{ pl: 4 }}
                          onClick={() => navigateTo(game.path)}
                        >
                          <ListItemText primary={game.name} secondary={game.engine} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>

                  <Divider />

                  <ListItemButton selected={isActive('/about')} onClick={() => navigateTo('/about')}>
                    <ListItemText primary="About" />
                  </ListItemButton>
                  <ListItemButton selected={isActive('/profile')} onClick={() => navigateTo('/profile')}>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </List>
                <Box sx={{ px: 2, pb: 2 }}>
                  <PlayerStatus compact />
                </Box>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
