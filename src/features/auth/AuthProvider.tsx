"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { me as fetchMe, logout as apiLogout } from "./api/auth";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  /** true selama pengecekan sesi pertama ke /me */
  loading: boolean;
  /** Dipanggil setelah login berhasil supaya context langsung terisi */
  setUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Menyimpan sesi Sanctum untuk seluruh app. Sesi ada di cookie HttpOnly,
 * jadi satu-satunya cara tahu user sedang login adalah memanggil /me.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: AuthUser | null; loading: boolean }>(
    { user: null, loading: true },
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchMe(controller.signal)
      .then((user) => setState({ user, loading: false }))
      // 401 = belum login; penjaga rute yang menangani pengalihannya
      .catch(() => {
        if (!controller.signal.aborted) setState({ user: null, loading: false });
      });

    return () => controller.abort();
  }, []);

  const setUser = useCallback((user: AuthUser) => {
    setState({ user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
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
