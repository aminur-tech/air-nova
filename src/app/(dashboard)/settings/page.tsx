'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

import { Card } from '@/components/ui/card';
import { 
  User, 
  Bell, 
  Shield, 
  Camera, 
  Loader2, 
  Check, 
  X, 
  Verified, 
  ShieldAlert,
  Mail,
  Phone,
  Lock
} from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import { cn } from '@/utils/helpers';
import { AuthService } from '@/services/auth';

type TabType = 'profile' | 'notifications' | 'security';

export default function SettingsPage() {
  const { profile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Layout State
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  
  // Notification Mock States
  const [flightUpdates, setFlightUpdates] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);

  // Sync state if store loads asynchronously 
  if (profile && !fullName && profile.full_name) {
    setFullName(profile.full_name);
    setPhone(profile.phone || '');
  }

  // Handle Avatar LocalStorage Upload via Base64 Conversion
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 1.5MB to stay within LocalStorage limits.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setIsSaving(true);
      await AuthService.updateProfile(profile.id, { avatar_url: base64String });
      setIsSaving(false);
    };
    reader.readAsDataURL(file);
  };

  // Save textual modifications
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !fullName.trim()) return;

    setIsSaving(true);
    await AuthService.updateProfile(profile.id, {
      full_name: fullName.trim(),
      phone: phone.trim() || null
    });
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
      {/* Platform Navigation Layout element */}
      <DashboardSidebar role={profile?.role || 'passenger'} />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-5xl mx-auto w-full">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Account Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure your AeroSky configurations, preferences, and interface identity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* SETTINGS TABS */}
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 border-b md:border-b-0 border-white/5">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === 'profile' 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <User className="h-4 w-4" /> Personal Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === 'notifications' 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Bell className="h-4 w-4" /> Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === 'security' 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Shield className="h-4 w-4" /> Security
            </button>
          </div>

          {/* MAIN SETTINGS CONTENT CARD */}
          <Card className="md:col-span-3 bg-slate-900 border-white/5 p-6 shadow-xl rounded-2xl">
            
            {/* TAB CONTENT: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Public Profile</h3>
                  <p className="text-xs text-slate-400">Control information visible on system documentation and booking logs.</p>
                </div>

                {/* ADVANCED PROFILE IMAGE CONTROL */}
                <div className="flex items-center gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="relative group h-20 w-20 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-2xl border border-white/10 shadow-inner">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span>{profile?.full_name?.charAt(0) || 'P'}</span>
                    )}

                    {/* Mask Input action trigger */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSaving}
                      className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer text-[10px] gap-1 font-semibold text-white"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      Change
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Avatar Image Context</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Supports PNG or JPG under 1.5MB. Persisted directly into LocalStore storage schemas.</p>
                  </div>
                </div>

                {/* INPUT CONFIGURATIONS */}
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Full Account Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none transition"
                        required
                        disabled={isSaving}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Phone Contact</label>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-3 h-4 w-4 text-slate-500" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 focus:border-blue-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none transition"
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-500 block">Registered Email Reference (ReadOnly)</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 h-4 w-4 text-slate-600" />
                      <input
                        type="email"
                        value={profile?.email || 'unmapped'}
                        className="w-full bg-slate-950/40 border border-white/5 text-slate-500 cursor-not-allowed rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none"
                        disabled
                      />
                    </div>
                  </div>

                  {/* SAVE ENGINE ACTIONS */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setFullName(profile?.full_name || '');
                        setPhone(profile?.phone || '');
                      }}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl transition text-slate-300 font-medium"
                    >
                      Reset Info
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || !fullName.trim()}
                      className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 px-4 py-2.5 rounded-xl transition text-white font-semibold shadow-lg shadow-blue-600/10"
                    >
                      {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Save Configurations
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB CONTENT: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">System Preferences</h3>
                  <p className="text-xs text-slate-400">Determine how platform operations update your active tracking points.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Flight Status Real-time Logs</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Send instantaneous alerts regarding delays, gates changes, or schedules shifts.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={flightUpdates}
                      onChange={(e) => setFlightUpdates(e.target.checked)}
                      className="h-4 w-4 accent-blue-500 rounded bg-slate-950 border-white/10"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Special Promo Offers</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Receive structured newsletters containing exclusive flight deal tiers.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={promoEmails}
                      onChange={(e) => setPromoEmails(e.target.checked)}
                      className="h-4 w-4 accent-blue-500 rounded bg-slate-950 border-white/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Security & Verification</h3>
                  <p className="text-xs text-slate-400">Inspect cryptographic validation tokens and user states.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 text-sm">
                    {profile?.is_verified ? (
                      <>
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <Verified className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-400">Identity Document Confirmed</p>
                          <p className="text-xs text-slate-500 mt-0.5">This profile possesses high-tier verified schema declarations.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <ShieldAlert className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-amber-400">Standard Identity State</p>
                          <p className="text-xs text-slate-500 mt-0.5">Account verification status has not been escalated via official passports yet.</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 bg-slate-950/50 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                      <Lock className="h-3.5 w-3.5 text-blue-400" /> Authorization Context Token
                    </div>
                    <p className="font-mono text-xs text-slate-400 select-all break-all p-3 rounded-lg bg-slate-950 border border-white/5">
                      {profile?.id || 'null-ctx-token'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </Card>
        </div>
      </main>
    </div>
  );
}