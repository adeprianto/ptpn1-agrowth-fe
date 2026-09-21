"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";
import type { ApiError } from "@/lib/api-client";
import { login } from "./api/auth";
import { useAuthContext } from "./AuthProvider";

export function LoginPage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // sudah punya sesi -> langsung ke dashboard
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const loggedIn = await login(email.trim(), password, rememberMe);
      setUser(loggedIn);
      router.replace("/dashboard");
    } catch (err) {
      // 422 dari backend: email/password salah atau kena rate limit
      const apiError = err as ApiError;
      setError(
        apiError.errors?.email?.[0] ??
          apiError.message ??
          "Login gagal, coba lagi.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Panel kiri - branding, disembunyikan di layar sempit */}
      <div className="relative hidden w-full max-w-xl flex-col justify-between overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-800 to-emerald-950 p-10 text-white lg:flex">
        {/* Dekorasi garis abstrak (SVG asli, bukan foto) */}
        <Image
          src="/images/panel-login.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/85 via-emerald-800/70 to-emerald-950/90" />

        <div className="relative flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 rounded-xl bg-white p-2">
            <Image
              src="/images/ptpn1.png"
              alt=""
              fill
              priority
              className="object-contain p-1"
            />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">PTPN 1</p>
            <p className="text-sm text-emerald-100">
              Perkebunan Nusantara Group
            </p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight">
            Akselerasi Kompetensi &amp; Talenta Agribisnis Berkelanjutan.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100">
            Platform monitoring diklat, evaluasi kinerja kompetensi regional,
            serta validasi pelatihan terintegrasi di seluruh unit kerja PTPN 1.
          </p>

          <div className="mt-8 flex gap-10 border-t border-white/20 pt-6">
            <div>
              <p className="text-2xl font-bold">7 Regional</p>
              <p className="text-sm text-emerald-200">Unit Operasional Aktif</p>
            </div>
            <div>
              <p className="text-2xl font-bold">30,000+</p>
              <p className="text-sm text-emerald-200">SDM Terhubung</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-emerald-200/70">
          © {new Date().getFullYear()} PTPN1 Sistem Informasi Pengembangan SDM ·
          v0.1.0
        </p>
      </div>

      {/* Panel kanan - form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900">
            Selamat Datang Kembali
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Silakan masukkan Email Perusahaan dan kata sandi Anda untuk
            mengakses portal Pengembangan SDM.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                Email Akun <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="nama@ptpn1.test"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/30"
                />
                Ingat saya di perangkat ini
              </label>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="h-3.5 w-3.5" />
                Sesi 12 jam
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
            >
              {submitting ? "Memproses..." : "Masuk ke Dashboard"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
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
