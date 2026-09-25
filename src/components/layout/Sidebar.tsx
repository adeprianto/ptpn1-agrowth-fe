"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "cn";
import type { Role } from "@/types/auth";

const roleLabel: Record<Role, string> = {
  HO: "Head Office",
  REGIONAL: "Regional",
  UNIT: "Unit",
};

interface SidebarProps {
  /** Hanya berlaku di layar sempit, tempat sidebar jadi laci */
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // navigationConfig sekarang berbentuk NavGroup[], jadi filter role
  // harus dilakukan di dalam masing-masing grup (bukan langsung di
  // level atas seperti sebelumnya).
  // Grup yang semua item-nya ke-filter habis (misalnya user role UNIT
  // tapi grup itu isinya cuma item khusus HO) otomatis disembunyikan
  // lewat .filter(group => group.items.length > 0) di bawah.
  const groups = navigationConfig
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(user.role)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {/* Area gelap di belakang laci — hanya ada saat lacinya terbuka */}
      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          // tata letak
          "flex shrink-0 flex-col",
          // tampilan
          "bg-emerald-950 text-emerald-50",
          // gerak
          "transition-transform duration-200 ease-out",
          // ponsel & tablet — laci yang melayang di atas halaman
          "fixed inset-y-0 left-0 z-40 w-72",
          open ? "translate-x-0" : "-translate-x-full",
          // lg ke atas — kembali jadi kolom biasa yang selalu terlihat
          "lg:static lg:z-auto lg:w-64 lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
          <div className="relative h-9 w-9 shrink-0 rounded-xl bg-white p-2">
            <Image
              src="/images/ptpn1.png"
              alt=""
              fill
              priority
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-white">
              SI Pengembangan SDM
            </p>
            <p className="text-xs text-emerald-300/70">PTPN1</p>
          </div>

          {/* Penutup laci; di layar lebar sidebar memang selalu terbuka */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-emerald-300/70 hover:bg-emerald-900 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav, sekarang dikelompokkan per grup */}
        <nav className="scrollbar-dark flex-1 space-y-4 overflow-y-auto px-3 py-2">
          {groups.map((group) => (
            <div key={group.label}>
              {/* Label grup, misal "Overview", "SDM", "Kompetensi" */}
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400/60">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  // Semua halaman diawali /dashboard, jadi menu Dashboard hanya
                  // aktif di /dashboard itu sendiri; menu lain ikut aktif di
                  // sub-halamannya (mis. /dashboard/pegawai/123).
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      // menutup laci begitu pindah halaman; di layar lebar
                      // tidak ada efeknya karena lacinya memang tidak dipakai
                      onClick={onClose}
                      className={cn(
                        // tata letak
                        "group flex items-center gap-3",
                        // tampilan
                        "rounded-xl px-3 py-2.5",
                        // teks
                        "text-sm font-medium",
                        // gerak
                        "transition-colors",
                        // keadaan
                        isActive
                          ? "bg-emerald-800 text-white"
                          : "text-emerald-100/70 hover:bg-emerald-900 hover:text-white",
                      )}
                    >
                      <Icon
                        className={cn(
                          // ukuran
                          "h-4 w-4 shrink-0",
                          // keadaan
                          isActive
                            ? "text-emerald-300"
                            : "text-emerald-400/60 group-hover:text-emerald-300",
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Role tier badge */}
        <div className="border-t border-emerald-900 px-5 py-4 sm:px-6">
          <p className="text-[11px] uppercase tracking-wide text-emerald-400/70">
            Level Akses
          </p>
          <p className="text-sm font-medium text-white">{roleLabel[user.role]}</p>
          <p className="truncate text-xs text-emerald-300/60">
            {user.officeName}
          </p>
        </div>
      </aside>
    </>
  );
}
