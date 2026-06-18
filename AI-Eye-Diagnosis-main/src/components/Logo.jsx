import { Box, Typography } from '@mui/material';

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <img src="/image/logo.svg" alt="iDisease Logo" style={{ height: 42, objectFit: 'contain' }} />
    </Box>
  );
}
