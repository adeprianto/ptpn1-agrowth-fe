"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import { Alert, Button, Field, Input } from "@/components/ui";
import Image from "next/image";
import { useAuthContext } from "./AuthProvider";
import { apiPost } from "@/lib/http-client";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { mustBeEmail, requireText } from "@/lib/validation";
import type { UserResource } from "@/types/api/user";
import { toAuthUser } from "@/types/auth";

export function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User yang sudah punya sesi dialihkan ke dashboard oleh proxy (src/proxy.ts),
  // jadi halaman ini tidak perlu memeriksanya lagi.

  // Error 401 (kredensial salah) / 429 (rate limit) tampil di kotak merah di
  // atas form; error 422 dari backend otomatis menempel ke isiannya.
  const { submit, saving, errors, formError } = useFormSubmit<{
    email: string;
    password: string;
  }>({
    validate: (form) => ({
      email:
        requireText(form.email, "Email Akun") ??
        mustBeEmail(form.email, "Email Akun"),
      password: requireText(form.password, "Kata Sandi"),
    }),
    onSubmit: async (form) => {
      const { data } = await apiPost<UserResource>("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
        rememberMe,
      });

      setUser(toAuthUser(data));

      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      router.replace(callbackUrl);
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit({ email, password });
  }

  return (
    <div className="flex min-h-dvh bg-white">
      {/* Panel kiri - branding, disembunyikan di layar sempit */}
      <div className="relative hidden w-full max-w-xl flex-col justify-between overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-800 to-emerald-950 p-10 text-white lg:flex">
        {/* Dekorasi garis abstrak (SVG asli, bukan foto) */}
        <Image
          src="/images/panel-login.webp"
          alt="PTPN 1"
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
            Silakan masukkan Email Perusahaan dan kata sandi Anda untuk
            mengakses portal Pengembangan SDM.
          </p>

          {formError && (
            <Alert tone="error" className="mt-6">
              {formError}
            </Alert>
          )}

          {/* noValidate: pengecekan lewat `validate` supaya pesannya seragam */}
          <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field
              label="Email Akun"
              required
              htmlFor="login-email"
              error={errors.email}
            >
              <Input
                id="login-email"
                type="email"
                value={email}
                invalid={Boolean(errors.email)}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="nama@ptpn1.test"
              />
            </Field>

            <Field
              label="Kata Sandi"
              required
              htmlFor="login-password"
              error={errors.password}
            >
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  invalid={Boolean(errors.password)}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
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
            </Field>

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

            <Button
              type="submit"
              block
              loading={saving}
              className="bg-emerald-800 py-3 font-semibold hover:bg-emerald-900"
            >
              {saving ? "Memproses..." : "Masuk ke Dashboard"}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </Button>
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
