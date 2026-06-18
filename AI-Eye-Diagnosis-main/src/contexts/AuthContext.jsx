import { createContext, useContext, useState, useEffect } from 'react';
import { authService, profileService } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await profileService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login({ email, password });
    // authService already sets the token in localStorage
    const profile = await profileService.getProfile();
    setUser(profile);
    return result;
  };

  const googleLogin = async (idToken) => {
    const result = await authService.googleLogin({ idToken });
    const profile = await profileService.getProfile();
    setUser(profile);
    return result;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    const profile = await profileService.getProfile();
    setUser(profile);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const value = {
    user,
    login,
    googleLogin,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
