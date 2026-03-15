import axios from 'axios';
import { API_BASE_URL } from './constants';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Inject access token
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage');
  if (raw) {
    try {
      const state = JSON.parse(raw);
      const token = state?.state?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

// Handle 401 → try refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const raw = localStorage.getItem('auth-storage');
        if (raw) {
          const state = JSON.parse(raw);
          const refreshToken = state?.state?.refreshToken;
          if (refreshToken) {
            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
            const newToken = data.data.accessToken;

            // Update stored token
            const parsed = JSON.parse(raw);
            parsed.state.accessToken = newToken;
            localStorage.setItem('auth-storage', JSON.stringify(parsed));

            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
          }
        }
      } catch {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
