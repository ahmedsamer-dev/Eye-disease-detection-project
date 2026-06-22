import { createContext, useContext, useState, useEffect } from 'react';
import { authService, profileService } from '../api';

const AuthContext = createContext();

const USER_CACHE_KEY = 'cached_user';

function saveUserCache(profile) {
  try { localStorage.setItem(USER_CACHE_KEY, JSON.stringify(profile)); } catch {}
}

function loadUserCache() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearUserCache() {
  localStorage.removeItem(USER_CACHE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // 1. Restore cached profile immediately — no blank flash while waiting for API
    const cached = loadUserCache();
    if (cached) {
      setUser(cached);
      setLoading(false);
    }

    // 2. Verify token is still valid in the background
    try {
      const profile = await profileService.getProfile();
      setUser(profile);
      saveUserCache(profile);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        // Token is genuinely expired / revoked — force logout
        localStorage.removeItem('token');
        clearUserCache();
        setUser(null);
      }
      // For 5xx / network errors: keep existing session alive
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login({ email, password });
    const profile = await profileService.getProfile();
    setUser(profile);
    saveUserCache(profile);
    return result;
  };

  const googleLogin = async (idToken) => {
    const result = await authService.googleLogin({ idToken });
    const profile = await profileService.getProfile();
    setUser(profile);
    saveUserCache(profile);
    return result;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    const profile = await profileService.getProfile();
    setUser(profile);
    saveUserCache(profile);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    clearUserCache();
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const next = prev ? { ...prev, ...updates } : null;
      if (next) saveUserCache(next);
      return next;
    });
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
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
