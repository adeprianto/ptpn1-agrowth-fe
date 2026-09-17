"use client";

import { useState, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";

export interface DashboardCardMenuItem {
  label: string;
  onClick?: () => void;
}

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Tambahan class, mis. "lg:col-span-2" untuk atur lebar di grid */
  className?: string;
  /** Placeholder aksi menu titik-tiga. Ganti per card kalau perlu aksi nyata. */
  menuItems?: DashboardCardMenuItem[];
}

const defaultMenuItems: DashboardCardMenuItem[] = [
  { label: "Lihat Detail" },
  { label: "Unduh Data" },
];

export function DashboardCard({
  title,
  subtitle,
  children,
  className = "",
  menuItems = defaultMenuItems,
}: DashboardCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-4 ${className} shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</p>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Menu kartu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.onClick?.();
                      setMenuOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
