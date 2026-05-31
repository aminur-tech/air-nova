'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize auth state on mount
  useAuth();

  // Prevent hydration mismatch by only rendering after hydration
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
