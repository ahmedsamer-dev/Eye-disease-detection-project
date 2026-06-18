import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';

export default function NotFound() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Illustration */}
        <Box
          component="img"
          src="/image/404.svg"
          alt="Page not found"
          sx={{
            width: '100%',
            maxWidth: 500,
            mb: 4,
            objectFit: 'contain',
          }}
        />

        {/* 404 Text */}
        <Typography
          variant="h1"
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 900,
            fontSize: { xs: '4rem', md: '5.5rem' },
            color: theme.palette.primary.main,
            mb: 2,
            letterSpacing: '0.1em',
          }}
        >
          404
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: '0.95rem', md: '1.1rem' },
            lineHeight: 1.6,
            mb: 5,
            maxWidth: 480,
          }}
        >
          The page you're looking for isn't available. Try signing up or logging in to continue.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            px: 4,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            '&:hover': { bgcolor: theme.palette.primary.dark },
          }}
        >
          Go Home
        </Button>
      </Container>
    </Box>
  );
}
