import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getCookieOptions } from './lib/supabase'

export async function proxy(request: NextRequest) {
  const sharedOptions = getCookieOptions();
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          const mergedOptions = { ...options, ...sharedOptions };
          request.cookies.set({ name, value, ...mergedOptions })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...mergedOptions })
        },
        remove(name: string, options: CookieOptions) {
          const mergedOptions = { ...options, ...sharedOptions };
          request.cookies.set({ name, value: '', ...mergedOptions })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...mergedOptions })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. If trying to access Admin routes, must be logged in
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Role Guard: If logged in, check for 'taxexpert' tier for all LMS routes
  // Except for public routes like login, auth callback, and pricing (if hosted here)
  const publicPaths = ['/', '/login', '/auth/callback', '/pricing', '/about', '/contact', '/courses', '/dashboard'];
  const isPublicPath = publicPaths.some(path => 
    path === '/' 
      ? request.nextUrl.pathname === '/' 
      : request.nextUrl.pathname.startsWith(path)
  );

  if (user && !isPublicPath) {
    // Fetch user profile tier
    const { data: profile } = await supabase
      .from("users")
      .select("subscription_tier")
      .eq("auth_id", user.id) // Using auth_id as per previous context
      .maybeSingle();

    const allowedTiers = ["taxexpert", "admin", "teacher", "staff"];
    const adminTiers = ["admin", "teacher", "staff"];
    const userTier = profile?.subscription_tier?.toLowerCase();

    // 2.1 Block students from Admin Panel
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!userTier || !adminTiers.includes(userTier)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // 2.2 Standard LMS access check
    if (!userTier || !allowedTiers.includes(userTier)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
