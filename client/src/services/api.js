import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rebookify_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fmtPrice = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const coverFallback = (title = 'Book') =>
  `https://placehold.co/400x600/1a7a4c/ffffff?text=${encodeURIComponent(title.slice(0, 18))}`;

export default api;
