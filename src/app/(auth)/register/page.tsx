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

const registerSchema = z.object({
  fullName: z.string().min(2, 'Provide complete full name context'),
  email: z.string().email('Please fill standard structural email parameters'),
  password: z.string().min(6, 'Minimum length constraint is 6 values'),
});

type RegisterFields = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFields) => {
    setLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: 'passenger' // Securely passing user metadata directly to the payload
          }
        }
      });

      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }

      // Wait for auth state to sync before navigating
      await AuthService.syncSession();

      // Navigate after sync is complete
      router.push('/passenger');
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
          <h1 className="text-2xl font-bold tracking-tight">Create Passenger Profile</h1>
          <p className="text-sm text-slate-400">Initialize identity context inside platform layers</p>
        </div>

        {authError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 pl-1">Full Legal Name</label>
            <Input type="text" placeholder="Aminur Rahman" error={errors.fullName?.message} {...register('fullName')} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 pl-1">Email Context</label>
            <Input type="email" placeholder="passenger@domain.com" error={errors.email?.message} {...register('email')} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 pl-1">Choose Password</label>
            <Input type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Creating Global Record...' : 'Complete Registration'}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2">
          Already registered? <Link href="/login" className="text-blue-400 hover:underline">Sign In</Link>
        </div>
      </Card>
    </div>
  );
}