"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

export type ToastTone = "success" | "error";

interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

export interface ToastApi {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const toneStyle: Record<ToastTone, { icon: LucideIcon; iconColor: string; bar: string }> = {
  success: { icon: CheckCircle2, iconColor: "text-emerald-500", bar: "bg-emerald-500" },
  error: { icon: XCircle, iconColor: "text-rose-500", bar: "bg-rose-500" },
};

/** Pesan gagal biasanya lebih panjang (mis. alasan 409), jadi tampil lebih lama. */
const DURATION: Record<ToastTone, number> = { success: 4000, error: 8000 };

/** Toast lama dibuang supaya layar tidak penuh kalau aksi diulang-ulang. */
const MAX_VISIBLE = 4;

const ToastContext = createContext<ToastApi | null>(null);

const noopSubscribe = () => () => {};

/** false saat render di server & hidrasi pertama, true setelahnya di browser. */
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/**
 * Notifikasi singkat di pojok kanan atas. Dipasang sekali di root layout,
 * jadi toast tetap terlihat walau halaman berpindah — mis. form yang langsung
 * kembali ke daftar setelah berhasil disimpan.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  // portal baru dibuat di browser supaya hasil hidrasi sama dengan HTML server
  const isClient = useIsClient();

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((tone: ToastTone, title: string, description?: string) => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev, { id, tone, title, description }].slice(-MAX_VISIBLE));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, description) => show("success", title, description),
      error: (title, description) => show("error", title, description),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {isClient &&
        createPortal(
          <div
            aria-live="polite"
            className={cn(
              // posisi: di atas modal (z-50) supaya tetap terlihat
              "pointer-events-none fixed inset-x-4 top-4 z-60",
              "sm:inset-x-auto sm:right-4 sm:w-96",
              // tata letak
              "flex flex-col gap-2",
            )}
          >
            {toasts.map((toast) => (
              <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const [paused, setPaused] = useState(false);
  const { icon: Icon, iconColor, bar } = toneStyle[toast.tone];

  // hitung mundur berhenti selama kursor di atas toast supaya sempat dibaca
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), DURATION[toast.tone]);
    return () => window.clearTimeout(timer);
  }, [paused, toast.id, toast.tone, onDismiss]);

  return (
    <div
      role={toast.tone === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        // tata letak
        "pointer-events-auto relative flex gap-3 overflow-hidden",
        // tampilan
        "rounded-xl border border-slate-200 bg-white py-3 pr-3 pl-4 shadow-lg",
        "animate-toast-in",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", bar)} />
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)} />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium text-slate-800">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 break-words text-slate-500">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        aria-label="Tutup notifikasi"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 self-start rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * @example
 * const toast = useToast();
 * toast.success("Unit berhasil disimpan");
 * toast.error("Unit gagal dihapus", "Unit masih punya pegawai.");
 */
export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  return context;
}
