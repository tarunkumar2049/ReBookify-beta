import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    const token = localStorage.getItem('rebookify_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => { localStorage.removeItem('rebookify_token'); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password });
    localStorage.setItem('rebookify_token', r.data.token);
    setUser(r.data.user);
    notify('Login successful');
    return r.data.user;
  };

  const register = async (payload) => {
    const r = await api.post('/auth/register', payload);
    localStorage.setItem('rebookify_token', r.data.token);
    setUser(r.data.user);
    notify('Account created');
    return r.data.user;
  };

  const logout = () => {
    localStorage.removeItem('rebookify_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, notify, toast, setToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
