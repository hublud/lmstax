"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

import { supabase } from "@/lib/supabase";
import LogoSVG from "@/components/LogoSVG";
import SubscriptionModal from "@/components/SubscriptionModal";


export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [tempUserRole, setTempUserRole] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile from the main platform users table
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("role, subscription_tier")
          .eq("auth_id", data.user.id)
          .single();

        if (profileError) {
          // Fallback or handle error if user doesn't exist in the users table yet
          throw new Error("Unable to verify user account permissions.");
        }

        const isTeacherOrAdmin = userProfile?.role === "teacher" || userProfile?.role === "admin";
        const hasLmsAccess = isTeacherOrAdmin || userProfile?.subscription_tier === "TaxExpert";

        if (!hasLmsAccess) {
          // Instead of signing out, we show the modal
          setTempUserRole(userProfile?.role);
          setShowSubModal(true);
          return; // Stop here, modal will handle next step
        }

        // Give the session a moment to propagate to cookies/middleware
        setTimeout(() => {
          if (userProfile?.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      if (err.message === "Invalid login credentials") {
        setError("Invalid email or password");
      } else {
        setError(err.message || "Invalid credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Error signing in with Google");
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSubModal(false);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "var(--bg)" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[var(--accent)]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative space-y-5">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <LogoSVG className="h-12 w-auto mx-auto" />
          </Link>


          <h1 className="text-3xl font-extrabold text-gray-800 mt-4">Welcome back!</h1>
          <p className="text-gray-500 mt-1">Log in to continue your learning journey</p>
        </div>

        {/* ─── Login Form ─── */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[var(--border)]">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm mb-6 disabled:opacity-70"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or login with email</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 font-bold text-xs">!</span>
              </div>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="login-password" className="form-label mb-0">Password</label>
                <Link href="#" className="text-xs text-[var(--primary)] hover:underline font-medium">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="form-input pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[var(--primary)] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base py-3.5 justify-center mt-2 disabled:opacity-70"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  Verify & Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="https://www.taxnigeria.com/pricing" className="text-[var(--primary)] font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          Your data is protected with 256-bit SSL encryption
        </p>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubModal} 
        onClose={handleModalClose} 
      />
    </div>
  );
}
