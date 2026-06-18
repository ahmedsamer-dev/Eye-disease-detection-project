import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../components/Logo';
import { authService, getErrorMessage } from '../api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Forgot Password request, 2 = Reset Password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      setSuccess(response.message || 'Reset code sent successfully.');
      if (response.resetCode) {
        setResetCode(response.resetCode);
        setSuccess(`Reset code generated: ${response.resetCode} (Returned in response for development)`);
      }
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        resetCode,
        newPassword,
        confirmPassword
      });
      alert(response.message || 'Password has been reset successfully!');
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', p: 2 }}>
      <Paper elevation={24} sx={{ p: 5, width: '100%', maxWidth: 450, borderRadius: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Logo />
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, color: 'primary.main' }}>
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
            {step === 1 
              ? 'Enter your email address to receive a verification reset code' 
              : 'Enter verification code and your new password'
            }
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {step === 1 ? (
          <form onSubmit={handleSendCode}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600, borderRadius: 2, textTransform: 'none', fontSize: '1rem', bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              disabled
            />
            <TextField
              fullWidth
              label="Reset Code"
              variant="outlined"
              margin="normal"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600, borderRadius: 2, textTransform: 'none', fontSize: '1rem', bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setStep(1)}
              sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
            >
              Back to Request Code
            </Button>
          </form>
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Remembered password?{' '}
            <Link to="/login" style={{ color: '#1e3c72', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
