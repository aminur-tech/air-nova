import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Profile } from '@/types';

export const AuthService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as Profile;
    } catch (error) {
      console.error('Profile fetch exception:', error);
      return null;
    }
  },

  async syncSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        useAuthStore.getState().setProfile(null);
        return null;
      }

      if (!session?.user) {
        useAuthStore.getState().setProfile(null);
        return null;
      }

      // Fetch user profile from database
      const profile = await this.getProfile(session.user.id);
      
      // Update store with profile
      useAuthStore.getState().setProfile(profile);
      
      return profile;
    } catch (error) {
      console.error('Session sync exception:', error);
      useAuthStore.getState().setProfile(null);
      return null;
    }
  },

  async logout() {
    try {
      await supabase.auth.signOut();
      useAuthStore.getState().logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};