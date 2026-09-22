"use client";

import type { ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button, SearchInput } from "@/components/ui";

interface TreeToolbarProps {
  /** Kotak pencarian; kosongkan untuk pohon tanpa pencarian */
  search?: { value: string; onChange: (value: string) => void; placeholder?: string };
  onExpandAll: () => void;
  onCollapseAll: () => void;
  /** Kontrol tambahan di kiri, mis. dropdown pemilih entity */
  children?: ReactNode;
}

/** Baris kontrol di atas pohon: pencarian, perluas semua, ciutkan semua. */
export function TreeToolbar({
  search,
  onExpandAll,
  onCollapseAll,
  children,
}: TreeToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {children}

      {search && (
        <div className="max-w-xs flex-1">
          <SearchInput
            value={search.value}
            onValueChange={search.onChange}
            placeholder={search.placeholder}
          />
        </div>
      )}

      <Button variant="outline" size="lg" icon={Maximize2} onClick={onExpandAll}>
        Perluas Semua
      </Button>
      <Button variant="outline" size="lg" icon={Minimize2} onClick={onCollapseAll}>
        Ciutkan Semua
      </Button>
    </div>
  );
}

interface TreeExplorerProps {
  loading?: boolean;
  error?: string | null;
  /** true kalau data sudah dimuat tapi tidak ada simpul sama sekali */
  empty?: boolean;
  loadingLabel?: string;
  errorLabel?: string;
  emptyLabel?: string;
  children: ReactNode;
}

/**
 * Kotak pembungkus pohon, sekaligus menangani status memuat, error, dan kosong
 * supaya halaman pohon tidak perlu menulis ulang ketiganya.
 *
 * @example
 * <TreeToolbar search={{ value: q, onChange: setQ }} onExpandAll={...} onCollapseAll={...} />
 * <TreeExplorer loading={loading} error={error} empty={roots.length === 0}>
 *   {roots.map((root) => <OrgTreeRow key={root.id} node={root} ... />)}
 * </TreeExplorer>
 */
export function TreeExplorer({
  loading = false,
  error = null,
  empty = false,
  loadingLabel = "Memuat data...",
  errorLabel = "Gagal memuat data",
  emptyLabel = "Belum ada data.",
  children,
}: TreeExplorerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      {error ? (
        <p className="px-3 py-8 text-center text-sm text-rose-600">
          {errorLabel}: {error}
        </p>
      ) : loading ? (
        <p className="px-3 py-8 text-center text-sm text-slate-400">{loadingLabel}</p>
      ) : empty ? (
        <p className="px-3 py-8 text-center text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        children
      )}
    </div>
  );
}
