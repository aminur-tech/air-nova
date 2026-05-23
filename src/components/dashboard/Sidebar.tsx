'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { 
  User, 
  Plane, 
  Ticket, 
  Users, 
  BarChart3, 
  LogOut, 
  Settings 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  role: 'passenger' | 'admin';
}

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const links = role === 'admin' 
    ? [
        { href: '/admin', label: 'Overview', icon: BarChart3 },
        { href: '/admin/flights', label: 'Manage Flights', icon: Plane },
        { href: '/admin/bookings', label: 'Bookings', icon: Ticket },
        { href: '/admin/users', label: 'Passengers', icon: Users },
      ]
    : [
        { href: '/passenger', label: 'My Bookings', icon: Ticket },
        { href: '/passenger/profile', label: 'Profile Details', icon: User },
        { href: '/passenger/settings', label: 'Account Settings', icon: Settings },
      ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {role} Portal
          </p>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group text-slate-400 hover:text-white hover:bg-white/5",
                  isActive && "text-white bg-blue-600/10 border border-blue-500/20"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/5 rounded-xl border border-blue-500/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 z-10", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white")} />
                <span className="z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full"
      >
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </button>
    </aside>
  );
}