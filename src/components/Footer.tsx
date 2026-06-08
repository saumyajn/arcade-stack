import { Box, IconButton, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: { xs: 2, md: 4 },
        backgroundColor: 'rgba(13,11,24,0.82)',
        backdropFilter: 'blur(14px)',
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        boxShadow: '0 -18px 45px rgba(0,0,0,0.22)',
      }}
    >
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          component="a"
          href="https://saumyajain.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Saumya Jain portfolio"
          sx={{
            width: 44,
            height: 44,
            border: '1px solid',
            borderColor: 'primary.main',
            color: 'primary.main',
            fontSize: '0.86rem',
            fontWeight: 900,
            letterSpacing: 0,
            '&:hover': {
              bgcolor: 'rgba(139,92,246,0.14)',
            },
          }}
        >
          SJ
        </IconButton>
        <IconButton
          component="a"
          href="https://github.com/saumyajn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.linkedin.com/in/saumya-jain06/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton component="a" href="mailto:saumyajn1994@gmail.com">
          <EmailIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Built by{' '}
        <Box
          component="a"
          href="https://saumyajain.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Saumya Jain
        </Box>{' '}
        - Arcade Stack (c) {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
