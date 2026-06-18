import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../api';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', p: 2 }}>
      <Paper elevation={24} sx={{ p: 5, width: '100%', maxWidth: 450, borderRadius: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Logo />
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, color: 'primary.main' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sign in to continue to EyeDiseaseAI
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5, mb: 1 }}>
            <Link to="/forgot-password" style={{ color: '#1e3c72', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </Box>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600, borderRadius: 2, textTransform: 'none', fontSize: '1rem', bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Box sx={{ flex: 1, borderBottom: 1, borderColor: 'divider' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>OR</Typography>
          <Box sx={{ flex: 1, borderBottom: 1, borderColor: 'divider' }} />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=784794762508-c185dkeb094cjr49em6j2rdmu2k5k57v.apps.googleusercontent.com&redirect_uri=http://localhost:5173/callback&response_type=id_token&scope=openid%20email%20profile&nonce=eye_disease_nonce'}
          sx={{
            py: 1.2,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            color: 'text.primary',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
              borderColor: 'text.primary',
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Continue with Google
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1e3c72', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
