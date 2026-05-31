'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthService } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const { isHydrated, setHydrated, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Initial session check - this will populate from localStorage if available
        await AuthService.syncSession();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        setHydrated(true);
      }
    };

    // Only initialize once after hydration
    if (!isHydrated) {
      initializeAuth();
    }

    // Setup active listener for real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Sync profile whenever auth state changes
        await AuthService.syncSession();
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [isHydrated, setHydrated, setLoading]);
}