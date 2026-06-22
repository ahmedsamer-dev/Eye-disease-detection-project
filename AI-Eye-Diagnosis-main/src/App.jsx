import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme, Box } from '@mui/material';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import PersonalInfo from './pages/PersonalInfo.jsx';
import Reports from './pages/Reports.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Callback from './pages/Callback.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/Navbar.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <WithNav>{children}</WithNav> : <Navigate to="/login" />;
}

function WithNav({ children }) {
  const theme = useTheme();
  return (
    <>
      <Navbar />
      <Box sx={{
        mt: '72px',
        minHeight: 'calc(100vh - 72px)',
        bgcolor: theme.palette.background.default,
      }}>
        {children}
      </Box>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/callback" element={<Callback />} />
        
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/personal-info" element={<PrivateRoute><PersonalInfo /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/reports/:id" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

