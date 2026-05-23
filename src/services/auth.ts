import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Profile } from '@/types';

export const AuthService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) return null;
    return data as Profile;
  },

  async syncSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      useAuthStore.getState().setProfile(null);
      return null;
    }

    const profile = await this.getProfile(session.user.id);
    useAuthStore.getState().setProfile(profile);
    return profile;
  }
};