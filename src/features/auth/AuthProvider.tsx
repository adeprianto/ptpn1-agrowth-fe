"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import AuthUser, { toAuthUser } from "@/types/auth";
import { apiGet, apiPost } from "@/lib/http-client";
import type { UserResource } from "@/types/api/user";

interface AuthContextValue {
  user: AuthUser | null;
  /** true selama pengecekan sesi pertama ke /api/auth/me */
  loading: boolean;
  /** Dipanggil setelah login berhasil supaya context langsung terisi */
  setUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Menyimpan sesi untuk seluruh app. Token ada di cookie HttpOnly, jadi
 * satu-satunya cara tahu user sedang login adalah memanggil route handler
 * `/api/auth/me` — browser tidak pernah menyentuh backend langsung.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: AuthUser | null; loading: boolean }>(
    { user: null, loading: true },
  );

  useEffect(() => {
    const controller = new AbortController();

    apiGet<UserResource>("/api/auth/me", undefined, controller.signal)
      .then(({ data }) => {
        setState({ user: toAuthUser(data), loading: false });
      })
      .catch(() => {
        // 401 = belum login. Error lain juga diperlakukan sebagai "tidak login"
        // supaya app tidak menggantung di layar loading.
        if (!controller.signal.aborted) {
          setState({ user: null, loading: false });
        }
      });

    return () => controller.abort();
  }, []);

  const setUser = useCallback((user: AuthUser) => {
    setState({ user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiPost("/api/auth/logout");
    } catch (error) {
      // Cookie tetap dibuang di sisi server pada kasus apa pun; kalaupun
      // request gagal total, user tetap dikeluarkan dari state lokal.
      console.error("Logout gagal dikirim ke server:", error);
    } finally {
      setState({ user: null, loading: false });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: state.user, loading: state.loading, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext harus dipakai di dalam <AuthProvider>");
  }

  return context;
}
