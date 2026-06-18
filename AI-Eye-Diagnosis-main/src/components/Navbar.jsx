import { AppBar, Toolbar, Box, Button, Avatar, IconButton, useTheme, Menu, MenuItem, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import PersonIcon from '@mui/icons-material/Person';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { useThemeMode } from '../contexts/ThemeContext.jsx';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getFullImageUrl } from '../api';

const NAV_LINKS = [
  { label: 'Home', to: '/home' },
  { label: 'History', to: '/history' },
  { label: 'Reports', to: '/reports' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: 72,
        justifyContent: 'center',
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.customShadows?.header?.[theme.palette.mode] || '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 8 }, justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <Logo />
          </NavLink>
        </Box>

        <Box sx={{ display: 'flex', gap: { xs: 2, md: 5 }, alignItems: 'center', flex: 2, justifyContent: 'center' }}>
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <Button
                  disableRipple
                  sx={{
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': { background: 'none', color: theme.palette.primary.main },
                    minWidth: 'auto',
                    p: 0,
                  }}
                >
                  {label}
                </Button>
              )}
            </NavLink>
          ))}
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={toggleTheme} sx={{ color: theme.palette.text.secondary }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {user ? (
            <>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', mr: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {user.email}
                </Typography>
              </Box>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar 
                  src={getFullImageUrl(user.profileImageUrl)} 
                  sx={{ bgcolor: theme.palette.primary.main }}
                >
                  {user.fullName ? user.fullName[0] : 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

