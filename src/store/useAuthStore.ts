import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile } from '@/types';

interface AuthState {
  profile: Profile | null;
  isLoading: boolean;
  isHydrated: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: true,
      isHydrated: false,
      setProfile: (profile) => set({ profile, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      logout: () => set({ profile: null, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ profile: state.profile }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          state.setLoading(false);
        }
      },
    }
  )
);