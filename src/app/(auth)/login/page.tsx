'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email context'),
  password: z.string().min(6, 'Password parameters must exceed 6 indices'),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFields) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }

      // Wait for auth state to sync before navigating
      await AuthService.syncSession();

      // Navigate after sync is complete
      router.push('/');
      router.refresh();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Sign In to AeroSky</h1>
          <p className="text-sm text-slate-400">Access premium full-stack flight routing modules</p>
        </div>

        {authError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 pl-1">Email Reference</label>
            <Input type="email" placeholder="you@domain.com" error={errors.email?.message} {...register('email')} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 pl-1">Security Key</label>
            <Input type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Authenticating Runtime...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2">
          No active profile? <Link href="/register" className="text-blue-400 hover:underline">Create Account</Link>
        </div>
      </Card>
    </div>
  );
}