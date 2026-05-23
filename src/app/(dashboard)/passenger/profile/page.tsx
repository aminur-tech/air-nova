'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/card';
import { ShieldAlert, Verified } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/Sidebar';

export default function PassengerProfilePage() {
  const { profile } = useAuthStore();

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">
      <DashboardSidebar role="passenger" />

      <main className="flex-1 p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Profile Credentials
          </h1>
          <p className="text-slate-400 text-sm">Manage persistent identity schema declarations.</p>
        </div>

        <Card className="max-w-2xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xl text-white">
              {profile?.full_name?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile?.full_name || 'Loading Context Name...'}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                {profile?.is_verified ? (
                  <>
                    <Verified className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">Verified Account Profile</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">Standard Non-Verified State</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-900 text-sm">
            <div>
              <span className="text-xs text-slate-500 block font-mono uppercase tracking-wider">System ID Token</span>
              <span className="font-mono text-slate-300 break-all">{profile?.id || 'null-ctx-token'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-mono uppercase tracking-wider">Email Reference</span>
              <span className="text-slate-300">{profile?.email || 'unmapped'}</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}