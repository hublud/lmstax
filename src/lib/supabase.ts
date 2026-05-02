import { createClient } from "@supabase/supabase-js";

// Helper to get supabase client safely
export const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Return a dummy client or null during build if variables are missing
  if (!url || !key) {
    if (typeof window === "undefined") {
      // Return a proxy that catches calls during build time
      return new Proxy({}, {
        get: () => () => ({ data: null, error: null })
      }) as any;
    }
    return null as any;
  }

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

export const supabase = getSupabase();
