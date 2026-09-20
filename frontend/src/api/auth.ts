import api from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<{ token: string }> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<void> => {
    await api.post('/auth/register', payload);
  },
};
