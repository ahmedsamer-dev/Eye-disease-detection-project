import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../api';

export default function Callback() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse token from hash (e.g. #id_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        let idToken = hashParams.get('id_token');

        // Parse from query parameters as fallback (e.g. ?id_token=...)
        if (!idToken) {
          const queryParams = new URLSearchParams(window.location.search);
          idToken = queryParams.get('id_token') || queryParams.get('idToken') || queryParams.get('credential');
        }

        if (!idToken) {
          throw new Error('Google Identity Token (idToken) not found in redirect URL.');
        }

        await googleLogin(idToken);
        navigate('/home');
      } catch (err) {
        console.error('OAuth Callback Error:', err);
        setError(getErrorMessage(err));
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      }
    };

    handleCallback();
  }, [navigate, googleLogin]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      {error ? (
        <Box sx={{ maxWidth: 450, width: '100%', textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Redirecting back to login screen...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={50} sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Completing Google Sign-in
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Please wait while we establish a secure session...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
