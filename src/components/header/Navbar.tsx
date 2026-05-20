"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Plane,
  Bell,
  UserCircle2,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Flights", href: "/flights" },
  { name: "Bookings", href: "/dashboard/bookings" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white"
        >
          <div className="rounded-xl bg-sky-500 p-2">
            <Plane className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide">
              SkyJourney
            </h1>
            <p className="text-xs text-slate-400">
              Flight Management
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          
          {/* Notification */}
          <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>

          {/* User */}
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10">
            <UserCircle2 className="h-5 w-5 text-sky-400" />
            <span className="text-sm text-white">
              Account
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          className="rounded-lg p-2 text-white md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950 md:hidden">
          <div className="space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {link.name}
              </Link>
            ))}

            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 font-medium text-white transition hover:bg-sky-600">
              <UserCircle2 className="h-5 w-5" />
              Login Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}