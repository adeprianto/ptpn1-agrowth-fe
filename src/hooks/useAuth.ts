"use client";

import { useAuthContext } from "@/features/auth/AuthProvider";
import type { AuthUser } from "@/types/auth";

/**
 * Dipakai komponen di dalam area yang sudah dijaga `RequireAuth`, jadi user
 * dijamin ada. Untuk halaman publik (mis. /login) pakai `useAuthContext`
 * langsung karena di sana user bisa null.
 */
export function useAuth(): { user: AuthUser; logout: () => Promise<void> } {
  const { user, logout } = useAuthContext();

  if (!user) {
    throw new Error("useAuth dipakai di luar area yang dijaga RequireAuth");
  }

  return { user, logout };
}
