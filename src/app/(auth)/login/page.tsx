'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../context/useAuthStore';
import GoogleLogin from '../google/page';
import { Eye, EyeOff, Lock, Mail, PlaneTakeoff } from 'lucide-react';

const Login = () => {
  const { login, loading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      // Handled gracefully inside Zustand error stream
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 font-sans text-slate-200">
      {/* Branding Splash Column */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_45%)]" />
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wider relative z-10">
          <PlaneTakeoff className="w-6 h-6 text-blue-400 animate-pulse" />
          <span>AIRNOVA</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Fly Globally with Absolute Safety.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Access your secure portal to coordinate flights, verify travel documents, and explore premium luxury cabins.
          </p>
        </div>
        <p className="text-xs text-slate-500 relative z-10">© 2026 AirNova Systems. Enterprise Grade Operations.</p>
      </div>

      {/* Dynamic Form Interlocking Interface */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-20">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 mt-2 text-sm">Please provide your verified flight credentials</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex justify-between items-center animate-fade-in">
              <span>{error}</span>
              <button onClick={clearError} className="text-xs underline hover:text-red-300">Dismiss</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@passport.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-12 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/10 active:scale-[0.99] flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-950 px-3 text-slate-500">Or corporate access via</span></div>
          </div>

          <GoogleLogin />

          <p className="text-center text-sm text-slate-500 mt-6">
            New traveler?{' '}
            <Link href="/register" className="text-blue-400 hover:underline font-medium">Create custom account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;