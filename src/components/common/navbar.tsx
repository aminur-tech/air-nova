'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plane,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/services/auth';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/helpers';

export default function Navbar() {
  const pathname = usePathname();

  const { profile } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await AuthService.logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.href = '/login';
  };

  const navLinks = [
    {
      href: '/flights',
      label: 'Book Flights'
    },
    {
      href: '/#offers',
      label: 'Special Offers'
    },
    {
      href: '/#status',
      label: 'Flight Status'
    }
  ];

  return (
    <header className="w-full h-16 sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex items-center justify-between">

      {/* LOGO */}
      <Link
        href="/"
        className="flex items-center gap-2 group z-50"
      >
        <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
          <Plane className="h-5 w-5 text-blue-400 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>

        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
          AeroSky
        </span>
      </Link>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-slate-400 hover:text-white transition-colors duration-200 relative py-1',
              pathname === link.href && 'text-white'
            )}
          >
            {link.label}

            {pathname === link.href && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      {/* DESKTOP AUTH */}
      <div className="hidden md:flex items-center gap-4">
        {profile ? (
          <div className="relative">

            {/* USER BUTTON */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all text-sm font-medium text-slate-200"
            >

              {/* AVATAR */}
              <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-400 uppercase">
                {profile.full_name?.charAt(0)}
              </div>

              {/* NAME */}
              <div className="flex flex-col items-start leading-none">
                <span className="max-w-[120px] truncate text-sm">
                  {profile.full_name}
                </span>

                <span className="text-[10px] text-slate-500 uppercase">
                  {profile.role}
                </span>
              </div>

              <ChevronDown
                className={cn(
                  'h-4 w-4 text-slate-500 transition-transform',
                  dropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* DROPDOWN */}
            {dropdownOpen && (
              <>
                {/* OVERLAY */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* MENU */}
                <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">

                  {/* USER INFO */}
                  <div className="px-3 py-3 border-b border-white/5 mb-2">
                    <div className="flex items-center gap-3">

                      <div className="h-10 w-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-400 uppercase">
                        {profile.full_name?.charAt(0)}
                      </div>

                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">
                          {profile.full_name}
                        </p>

                        <p className="text-xs text-slate-400 truncate">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DASHBOARD */}
                  <Link
                    href={profile.role === 'admin' ? '/admin' : '/passenger'}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-blue-400" />
                    Dashboard
                  </Link>

                  {/* PROFILE */}
                  <Link
                    href="/passenger/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    My Profile
                  </Link>

                  {/* ADMIN MENU */}
                  {profile.role === 'admin' && (
                    <>
                      <div className="border-t border-white/5 my-2" />

                      <Link
                        href="/admin/flights/create"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Plane className="h-4 w-4 text-emerald-400" />
                        Add Flight
                      </Link>

                      <Link
                        href="/admin/flights"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Plane className="h-4 w-4 text-cyan-400" />
                        Manage Flights
                      </Link>
                    </>
                  )}

                  <div className="border-t border-white/5 my-2" />

                  {/* LOGOUT */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>

            <Button variant="primary" size="sm" asChild>
              <Link href="/register">
                Register
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="flex md:hidden p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-slate-400 hover:text-white z-50"
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950 z-40 flex flex-col pt-24 px-6 space-y-6 md:hidden">

          {/* MOBILE NAV */}
          <nav className="flex flex-col space-y-4 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-slate-400 py-2',
                  pathname === link.href && 'text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <hr className="border-white/5" />

          {/* MOBILE AUTH */}
          <div className="flex flex-col gap-3">

            {profile ? (
              <>
                {/* PROFILE CARD */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">

                  <div className="h-12 w-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-lg font-bold text-blue-400 uppercase">
                    {profile.full_name?.charAt(0)}
                  </div>

                  <div className="overflow-hidden">
                    <p className="text-white font-semibold truncate">
                      {profile.full_name}
                    </p>

                    <p className="text-xs text-slate-400 truncate">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* DASHBOARD */}
                <Link
                  href={profile.role === 'admin' ? '/admin' : '/passenger'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-slate-300 text-base"
                >
                  <LayoutDashboard className="h-5 w-5 text-blue-400" />
                  Dashboard
                </Link>

                {/* PROFILE */}
                <Link
                  href="/passenger/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-slate-300 text-base"
                >
                  <User className="h-5 w-5 text-slate-400" />
                  My Profile
                </Link>

                {/* ADMIN */}
                {profile.role === 'admin' && (
                  <Link
                    href="/admin/flights/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-slate-300 text-base"
                  >
                    <Plane className="h-5 w-5 text-emerald-400" />
                    Add Flight
                  </Link>
                )}

                {/* LOGOUT */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 py-3 text-red-400 text-base text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-3 w-full">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  asChild
                >
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>

                <Button
                  variant="primary"
                  className="w-full justify-center"
                  asChild
                >
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}