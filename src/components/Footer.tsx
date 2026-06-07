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
      <Box sx={{ mb: 1 }}>
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
      <Typography variant="body2">
        Built by Saumya Jain - Arcade Stack (c) {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
