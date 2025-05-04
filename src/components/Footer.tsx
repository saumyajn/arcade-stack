import { Box, Typography,IconButton, useTheme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: { xs: 2, md: 4 },
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(0,0,0,0.6)'
            : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
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
        <IconButton component="a" href="mailto:saumyajn1994@email.com">
          <EmailIcon />
        </IconButton>
      </Box>
      <Typography variant="body2">
        Built with ❤️ by Saumya Jain— Arcade Stack © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
