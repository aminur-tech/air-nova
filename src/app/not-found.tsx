'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlaneTakeoff, MoveLeft, Home, Compass, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden px-4 select-none font-sans text-slate-100">
      
      {/* BACKGROUND GRAPHICS: RADAR & GLOW MESH LAYER */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-2xl" />
        {/* Radial Matrix Line Grids */}
        <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full animate-pulse duration-4000" />
        <div className="absolute w-[300px] h-[300px] border border-white/5 rounded-full" />
      </div>

      <div className="z-10 w-full max-w-xl text-center space-y-8 flex flex-col items-center">
        
        {/* TOP INTERACTIVE CARD */}
        <div className="relative group">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl shadow-2xl transition-all duration-300 group-hover:border-blue-500/20 relative">
            <Radio className="h-6 w-6 text-blue-400 animate-ping absolute -top-1 -right-1 opacity-70" />
            <PlaneTakeoff className="h-10 w-10 text-blue-400 stroke-[1.25] -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>

        {/* GLITCH-TEXT TIER VECTOR */}
        <div className="space-y-3">
          <h1 className="text-8xl md:text-9xl font-black font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-700 leading-none">
            404
          </h1>
          <h2 className="text-xl font-bold tracking-tight text-slate-200 uppercase font-mono">
            Flight Route Altered / Signal Lost
          </h2>
          <p className="max-w-md mx-auto text-sm text-slate-400 leading-relaxed">
            The navigational waypoint coordinates you requested do not map out on AeroSky’s digital flight grids. The page has been archived or decommissioned.
          </p>
        </div>

        {/* PRIMARY ACTION LAYER INTERFACE */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 text-sm bg-slate-900 border border-white/10 hover:border-white/20 active:scale-98 text-slate-300 px-4 py-3 rounded-xl transition duration-200 font-medium group"
          >
            <MoveLeft className="h-4 w-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
            Previous Terminal
          </button>

          <Link
            href="/"
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 text-sm bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/15 active:scale-98 text-white px-4 py-3 rounded-xl transition duration-200 font-semibold"
          >
            <Home className="h-4 w-4 stroke-[2]" />
            Return to Core Base
          </Link>
        </div>

        {/* ALTERNATIVE DEEP LINKS MAP */}
        <div className="pt-6 border-t border-white/5 w-full max-w-md">
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-4 select-none">
            Suggested Alternative Routings
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link 
              href="/flights" 
              className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.01] border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <Compass className="h-3.5 w-3.5 text-blue-400" /> Book Flights Matrix
            </Link>
            <Link 
              href="/passenger/profile" 
              className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.01] border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400" /> Identity Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}