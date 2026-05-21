import { api } from '@/services/api';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar: string;
  role: 'user' | 'admin';
  is_verified: boolean;
}

// Define the expected error structure from your Express API backend
interface ApiErrorResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: object) => Promise<void>;
  loginWithGoogle: (token: string, user: UserProfile) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('_auth_usr') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('_auth_tk') : null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data.success) {
        const { accessToken, user } = res.data;
        localStorage.setItem('_auth_tk', accessToken);
        localStorage.setItem('_auth_usr', JSON.stringify(user));
        set({ token: accessToken, user, loading: false });
      }
    } catch (err: unknown) {
      let runtimeErrorMessage = 'Authentication process encountered an error.';

      // Check if the error is an Axios network issue
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        runtimeErrorMessage = 
          axiosError.response?.data?.message || 
          axiosError.response?.data?.error || 
          axiosError.message || 
          runtimeErrorMessage;
      } else if (err instanceof Error) {
        // Fallback for standard javascript engine errors
        runtimeErrorMessage = err.message;
      }

      set({ 
        error: runtimeErrorMessage, 
        loading: false 
      });
      throw err;
    }
  },

  loginWithGoogle: (token, user) => {
    localStorage.setItem('_auth_tk', token);
    localStorage.setItem('_auth_usr', JSON.stringify(user));
    set({ token, user, error: null });
  },

  logout: () => {
    localStorage.removeItem('_auth_tk');
    localStorage.removeItem('_auth_usr');
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null })
}));