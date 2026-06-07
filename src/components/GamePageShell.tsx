import { Box, Chip, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { NeonPanel, ShinyText } from './MotionBits';

type GamePageShellProps = {
  title: string;
  description: string;
  tags?: string[];
  children: ReactNode;
};

export default function GamePageShell({ title, description, tags = [], children }: GamePageShellProps) {
  return (
    <Box sx={{ py: { xs: 3, md: 5 }, maxWidth: 1120, mx: 'auto' }}>
      <NeonPanel
        glow="primary"
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          <ShinyText>{title}</ShinyText>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.7 }}>
          {description}
        </Typography>
        {tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Stack>
        )}
      </NeonPanel>

      <NeonPanel
        glow="secondary"
        sx={{
          p: { xs: 2, md: 3 },
        }}
      >
        {children}
      </NeonPanel>
    </Box>
  );
}
