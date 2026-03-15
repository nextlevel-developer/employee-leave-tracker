import { api } from '../../../lib/axios';
import { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '@leave-tracker/shared-types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
