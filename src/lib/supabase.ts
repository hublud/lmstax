import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// Recursive proxy to handle any level of supabase calls during build
const createSilentProxy = (): any => {
  const proxy: any = new Proxy(() => proxy, {
    get: (target, prop) => {
      if (prop === 'then') return undefined;
      return proxy;
    },
    apply: () => ({ data: null, error: null, count: 0 })
  });
  return proxy;
};

// Shared cookie options for SSO between taxnigeria.com and academy.taxnigeria.com
export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    domain: isProd ? ".taxnigeria.com" : undefined, // Shared domain in prod, localhost in dev
    path: "/",
    sameSite: "lax" as const,
    secure: isProd,
  };
};

// Helper to get supabase client safely for Browser/Client side
export const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url === "undefined" || url === "null") {
    if (typeof window === "undefined") return createSilentProxy();
    return null as any;
  }

  try {
    // Using createBrowserClient ensures cookies are set correctly for middleware
    return createBrowserClient(url, key, {
      cookieOptions: getCookieOptions(),
    });
  } catch (e) {
    return createSilentProxy();
  }
};

// Helper for Admin/Service Role tasks (Server Side Only)
export const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key || url === "undefined" || url === "null") {
    return createSilentProxy();
  }

  try {
    return createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  } catch (e) {
    return createSilentProxy();
  }
};

export const supabase = getSupabase();
