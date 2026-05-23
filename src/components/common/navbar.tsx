'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, User, LayoutDashboard, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { Button } from '../ui/button';
import { cn } from '@/utils/helpers';

export default function Navbar() {
  const pathname = usePathname();
  const { profile, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/flights', label: 'Book Flights' },
    { href: '/#offers', label: 'Special Offers' },
    { href: '/#status', label: 'Flight Status' },
  ];

  return (
    <header className="w-full h-16 sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex items-center justify-between">
      
      {/* Brand Identification */}
      <Link href="/" className="flex items-center gap-2 group z-50">
        <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
          <Plane className="h-5 w-5 text-blue-400 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>
        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
          AeroSky
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-slate-400 hover:text-white transition-colors duration-200 relative py-1",
              pathname === link.href && "text-white"
            )}
          >
            {link.label}
            {pathname === link.href && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      {/* Action / Auth Context State Handler */}
      <div className="hidden md:flex items-center gap-4">
        {profile ? (
          <div className="relative">
            {/* Authenticated User Micro-Panel Trigger */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors text-sm font-medium text-slate-200"
            >
              <div className="h-6 w-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 uppercase">
                {profile.full_name?.charAt(0)}
              </div>
              <span className="max-w-[120px] truncate">{profile.full_name}</span>
              <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", dropdownOpen && "rotate-180")} />
            </button>

            {/* Contextual User Account Dropdown Modal Box */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs text-slate-300 font-medium truncate">{profile.email}</p>
                  </div>
                  
                  <Link 
                    href={profile.role === 'admin' ? '/admin' : '/passenger'}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-blue-400" />
                    <span>Control Panel</span>
                  </Link>

                  <Link 
                    href="/passenger/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>

                  <hr className="border-white/5 my-1" />

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Hamburger Menu Mobile Trigger */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="flex md:hidden p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-slate-400 hover:text-white z-50"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Full-Screen Drawer Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950 z-40 flex flex-col pt-24 px-6 space-y-6 animate-in fade-in duration-200 md:hidden">
          <nav className="flex flex-col space-y-4 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn("text-slate-400 py-2", pathname === link.href && "text-white")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <hr className="border-white/5" />

          <div className="flex flex-col gap-3 pt-2">
            {profile ? (
              <>
                <Link
                  href={profile.role === 'admin' ? '/admin' : '/passenger'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-slate-300 text-base"
                >
                  <LayoutDashboard className="h-5 w-5 text-blue-400" />
                  <span>Dashboard Control Panel</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 py-3 text-red-400 text-base text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out Account</span>
                </button>
              </>
            ) : (
              <div className="space-y-3 w-full">
                <Button variant="outline" className="w-full justify-center" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="primary" className="w-full justify-center" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}