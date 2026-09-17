"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types/auth";

const roleLabel: Record<Role, string> = {
  HO: "Head Office",
  REGIONAL: "Regional",
  UNIT: "Unit",
};

export function Sidebar() {
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
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-emerald-950 text-emerald-50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20">
          <Sprout className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight text-white">
            SI Pengembangan SDM
          </p>
          <p className="text-xs text-emerald-300/70">PTPN1</p>
        </div>
      </div>

      {/* Nav, sekarang dikelompokkan per grup */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-2">
        {groups.map((group) => (
          <div key={group.label}>
            {/* Label grup, misal "Overview", "SDM", "Kompetensi" */}
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400/60">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-800 text-white"
                        : "text-emerald-100/70 hover:bg-emerald-900 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? "text-emerald-300"
                          : "text-emerald-400/60 group-hover:text-emerald-300"
                      }`}
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
      <div className="border-t border-emerald-900 px-6 py-4">
        <p className="text-[11px] uppercase tracking-wide text-emerald-400/70">
          Level Akses
        </p>
        <p className="text-sm font-medium text-white">{roleLabel[user.role]}</p>
        <p className="truncate text-xs text-emerald-300/60">
          {user.officeName}
        </p>
      </div>
    </aside>
  );
}
