'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthService } from '@/services/auth';

export function useAuth() {
  useEffect(() => {
    // Perform initial session checks
    AuthService.syncSession();

    // Setup an active listener to stream auth updates instantly across layouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await AuthService.syncSession();
      } else {
        AuthService.syncSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}