"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Simple redirect to dashboard - browser handles the session
    router.push("/dashboard");
    router.refresh();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Redirecting...</h2>
      </div>
    </div>
  );
}
