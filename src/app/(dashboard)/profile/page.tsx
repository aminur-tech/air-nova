'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

import { Card } from '@/components/ui/card';
import { ShieldAlert, Verified, Loader2, Camera, Edit2, X, Check } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import { AuthService } from '@/services/auth';

export default function PassengerProfilePage() {
  const { profile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if profile loads late
  if (!fullName && profile?.full_name) {
    setFullName(profile.full_name);
  }

  // Handle Image Convert & Storage
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    // Optional: File size check (LocalStorage has a limit of ~5MB total)
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 1.5MB to save to LocalStorage safely.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setIsSaving(true);
      
      // Update Supabase and the local storage state managed by Zustand
      await AuthService.updateProfile(profile.id, {
        avatar_url: base64String
      });
      
      setIsSaving(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle Form Submission
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !fullName.trim()) return;

    setIsSaving(true);
    const updated = await AuthService.updateProfile(profile.id, {
      full_name: fullName.trim()
    });

    if (updated) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950 text-white">
      <DashboardSidebar role="passenger" />

      <main className="flex-1 p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Profile Credentials
          </h1>
          <p className="text-slate-400 text-sm">Manage persistent identity schema declarations.</p>
        </div>

        <Card className="max-w-2xl p-6 space-y-6 bg-slate-900 border-slate-800">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group h-20 w-20 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-2xl border-2 border-slate-800">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile Avatar" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{profile?.full_name?.charAt(0) || 'P'}</span>
              )}

              {/* Upload Trigger Overlay */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Camera className="h-5 w-5 text-white" />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">
                    {profile?.full_name || 'Loading Context Name...'}
                  </h2>
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
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form & Info Section */}
          <div className="pt-4 border-t border-slate-800">
            {isEditing ? (
              <form onSubmit={handleSaveChanges} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-2">
                    Full Name Context
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFullName(profile?.full_name || '');
                      setIsEditing(false);
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-md transition text-slate-400"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 px-3 py-2 rounded-md transition text-white font-medium"
                  >
                    {isSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block font-mono uppercase tracking-wider">System ID Token</span>
                  <span className="font-mono text-slate-300 break-all">{profile?.id || 'null-ctx-token'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-mono uppercase tracking-wider">Email Reference</span>
                  <span className="text-slate-300">{profile?.email || 'unmapped'}</span>
                </div>
              </div>
            )}
          </div>

        </Card>
      </main>
    </div>
  );
}