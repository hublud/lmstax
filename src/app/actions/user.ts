'use server';

import { getSupabaseAdmin } from '@/lib/supabase';

export async function getUserProfile(authId: string) {
  if (!authId) return { data: null, error: 'Auth ID is required' };

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Fetch user profile using the admin client to bypass RLS
    // This is safe because this is a server-side action and we've already 
    // authenticated the user in the login flow before calling this.
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('user_id, role, subscription_tier, email')
      .eq('auth_id', authId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in getUserProfile:', err);
    return { data: null, error: err.message || 'An unexpected error occurred' };
  }
}
