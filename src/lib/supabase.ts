import { createClient } from "@supabase/supabase-js";

// Recursive proxy to handle any level of supabase calls during build (e.g., supabase.auth.getSession())
const createSilentProxy = (): any => {
  const proxy: any = new Proxy(() => proxy, {
    get: (target, prop) => {
      if (prop === 'then') return undefined; // Avoid breaking async/await
      return proxy;
    },
    apply: () => ({ data: null, error: null, count: 0 })
  });
  return proxy;
};

// Helper to get supabase client safely
export const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url === "undefined") {
    if (typeof window === "undefined") {
      return createSilentProxy();
    }
    return null as any;
  }

  try {
    return createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (e) {
    console.warn("Supabase initialization failed, using silent proxy.");
    return createSilentProxy();
  }
};

// Helper for Admin/Service Role tasks
export const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key || url === "undefined" || url === "null") {
    return createSilentProxy();
  }

  try {
    return createClient(url, key);
  } catch (e) {
    return createSilentProxy();
  }
};

export const supabase = getSupabase();
