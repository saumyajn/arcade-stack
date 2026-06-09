import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { liveGames } from '../data/games';

export default function NotFound() {
  const location = useLocation();
  const suggestedGames = liveGames.slice(0, 4);

  return (
    <Box
      sx={{
        minHeight: { xs: '64dvh', md: '70dvh' },
        display: 'grid',
        placeItems: 'center',
        py: { xs: 5, md: 8 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 'min(100%, 920px)',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.035))',
          boxShadow: '0 28px 90px rgba(0,0,0,0.34)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.86fr 1.14fr' },
            minHeight: 380,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'grid',
              placeItems: 'center',
              p: { xs: 4, md: 5 },
              background:
                'radial-gradient(circle at 40% 35%, rgba(255,61,129,0.35), transparent 34%), radial-gradient(circle at 65% 70%, rgba(45,212,191,0.26), transparent 36%), rgba(13,11,24,0.76)',
              borderRight: { md: '1px solid' },
              borderBottom: { xs: '1px solid', md: 'none' },
              borderColor: 'divider',
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: { xs: 152, md: 184 },
                height: { xs: 152, md: 184 },
                borderRadius: '36px',
                display: 'grid',
                placeItems: 'center',
                color: 'primary.main',
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'rgba(5, 4, 16, 0.62)',
                boxShadow: 'inset 0 0 40px rgba(255,255,255,0.06), 0 22px 65px rgba(255,61,129,0.22)',
              }}
            >
              <SearchOffRoundedIcon sx={{ fontSize: { xs: 82, md: 102 } }} />
            </Box>
          </Box>

          <Stack spacing={3} sx={{ p: { xs: 3, sm: 4, md: 5 }, justifyContent: 'center' }}>
            <Stack spacing={1.25}>
              <Chip
                label="Route not found"
                color="primary"
                variant="outlined"
                sx={{ width: 'fit-content', fontWeight: 800 }}
              />
              <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '3.6rem' }, fontWeight: 950 }}>
                This level is missing.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 560, fontSize: { xs: '1rem', md: '1.08rem' } }}>
                The route <Box component="code" sx={{ color: 'text.primary' }}>{location.pathname}</Box> does not match an available ArcadeStack page.
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                component={RouterLink}
                to="/"
                size="large"
                variant="contained"
                startIcon={<HomeRoundedIcon />}
                sx={{ minHeight: 48 }}
              >
                Back to home
              </Button>
              <Button
                component={RouterLink}
                to="/about"
                size="large"
                variant="outlined"
                startIcon={<SportsEsportsRoundedIcon />}
                sx={{ minHeight: 48 }}
              >
                About ArcadeStack
              </Button>
            </Stack>

            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 900 }}>
                Try a live game
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                {suggestedGames.map((game) => (
                  <Chip
                    key={game.id}
                    component={RouterLink}
                    to={game.path}
                    clickable
                    label={game.name}
                    sx={{
                      minHeight: 38,
                      color: 'text.primary',
                      bgcolor: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,61,129,0.16)' },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
