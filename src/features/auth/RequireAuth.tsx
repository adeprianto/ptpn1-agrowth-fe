"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./AuthProvider";

/** Menahan halaman yang butuh login; kalau belum login diarahkan ke /login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-dvh items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">
          {loading ? "Memeriksa sesi..." : "Mengalihkan ke halaman login..."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
