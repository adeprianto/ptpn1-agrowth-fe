"use client";

import { useState, useTransition, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Sprout,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    startTransition(async () => {
      try {
        const callbackUrl =
          searchParams.get("callbackUrl") || "/dashboard";

        // Call Next.js Route Handler
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            rememberMe,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(
            data?.error || "NIK/Email atau password salah"
          );
          return;
        }

        if (data.success) {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (error) {
        console.error("Login error:", error);

        setError(
          "Tidak dapat terhubung ke server. Silakan coba lagi."
        );
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Panel kiri - branding */}
      <div className="relative hidden w-full max-w-xl flex-col justify-between overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-800 to-emerald-950 p-10 text-white lg:flex">
        <Image
          src="/images/panel-login.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/85 via-emerald-800/70 to-emerald-950/90" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Sprout className="h-8 w-8 text-white" />
          </div>

          <div>
            <p className="text-lg font-bold leading-tight">
              PTPN 1
            </p>

            <p className="text-sm text-emerald-100">
              Perkebunan Nusantara Group
            </p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight">
            Akselerasi Kompetensi &amp; Talenta Agribisnis
            Berkelanjutan.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-emerald-100">
            Platform monitoring diklat, evaluasi kinerja kompetensi
            regional, serta validasi pelatihan terintegrasi di seluruh
            unit kerja PTPN 1.
          </p>

          <div className="mt-8 flex gap-10 border-t border-white/20 pt-6">
            <div>
              <p className="text-2xl font-bold">
                6 Regional
              </p>

              <p className="text-sm text-emerald-200">
                Unit Operasional Aktif
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold">
                4,500+
              </p>

              <p className="text-sm text-emerald-200">
                SDM Terhubung
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-emerald-200/70">
          2026 PTPN 1 [Nama Sistem]. All Right Reserved
        </p>
      </div>

      {/* Panel kanan - form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900">
            Selamat Datang Kembali
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Silakan masukkan NIK / Email Perusahaan dan kata sandi
            Anda untuk mengakses portal Pengembangan SDM.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Error */}
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
                {error}
              </div>
            )}

            {/* Email / NIK */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                NIK/Email Akun{" "}
                <span className="text-rose-500">*</span>
              </label>

              <input
                name="email"
                type="text"
                required
                disabled={isPending}
                autoComplete="username"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                Kata Sandi{" "}
                <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isPending}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 disabled:opacity-60"
                />

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                  aria-label={
                    showPassword
                      ? "Sembunyikan sandi"
                      : "Tampilkan sandi"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  disabled={isPending}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/30 disabled:opacity-60"
                />

                Ingat saya di perangkat ini
              </label>

              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="h-3.5 w-3.5" />
                Sesi 12 jam
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  Memproses...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Mengalami kendala login?{" "}
            <a
              href="#"
              className="font-medium text-emerald-700 hover:underline"
            >
              Hubungi IT Helpdesk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
