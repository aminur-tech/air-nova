"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/context/useAuthStore";
import {
  Menu,
  X,
  Plane,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Compass,
  Briefcase,
  ChevronDown
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Compass },
  { name: "Flights", href: "/flights", icon: Plane },
  { name: "Bookings", href: "/dashboard/bookings", icon: Briefcase },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Connect seamlessly with your operational state manager
  const { user, logout } = useAuthStore();

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/75 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-3 text-white transition-opacity hover:opacity-95">
          <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Plane className="h-5 w-5 -rotate-45 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-white bg-clip-text">
              AirNova
            </h1>
            <p className="text-[10px] font-medium tracking-tight text-slate-400 uppercase">
              Aero Operations
            </p>
          </div>
        </Link>

        {/* Desktop Nav - Dynamic Focus Tracking */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && !!pathname?.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative rounded-xl px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 ${
                  isActive 
                    ? "text-blue-400 bg-blue-500/5 font-semibold" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-[-18px] left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-blue-500 shadow-md shadow-blue-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Control Interface (Mode Sensitive) */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            /* MODE A: AUTHORIZED PASSENGER CONTROLS */
            <>
              {/* Notification Interface */}
              <button className="relative rounded-xl border border-slate-800 bg-slate-900/40 p-2.5 text-slate-400 transition-all hover:bg-slate-900 hover:text-slate-200 active:scale-95">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              </button>

              {/* Profile Context Selector */}
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-1.5 pr-3 transition-all hover:bg-slate-900/90 active:scale-98"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile Avatar" className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/10" />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="max-w-[90px] truncate text-xs font-semibold text-slate-300">
                    {user.full_name?.split(' ')[0] || "User"}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Overlay */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-800 bg-slate-950 p-1.5 shadow-2xl animate-fade-in z-20">
                      <div className="px-3 py-2 border-b border-slate-900 mb-1">
                        <p className="text-xs font-semibold text-slate-200 truncate">{user.full_name || "Guest User"}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard Central
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Terminate Session
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            /* MODE B: UNAUTHENTICATED VISITOR CONTROLS */
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition hover:text-slate-200 hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/10 transition active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Command Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden transition-colors"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Control Canopy Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-900 bg-slate-950/95 backdrop-blur-lg md:hidden animate-fade-in">
          <div className="space-y-1.5 px-4 py-4">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-blue-600/10 text-blue-400" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="border-t border-slate-900 my-4 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-1 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 text-xs font-bold">
                      {user.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{user.full_name || "Guest User"}</p>
                      <p className="text-[10px] text-slate-500">{user.role.toUpperCase()} PORTAL</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-400 transition"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out Session
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 text-xs font-medium text-slate-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}