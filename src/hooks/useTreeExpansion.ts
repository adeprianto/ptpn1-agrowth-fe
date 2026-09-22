"use client";

import { useCallback, useState } from "react";

export interface TreeExpansion {
  /** Id simpul yang sedang terbuka */
  expanded: Set<string>;
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  expandAll: (ids: string[]) => void;
  collapseAll: () => void;
}

/**
 * Status buka/tutup simpul pohon.
 *
 * @param defaultExpanded Id yang terbuka sebelum user menyentuh apa pun —
 *                        biasanya simpul akar. Perubahan nilainya diabaikan
 *                        setelah user mengatur sendiri.
 */
export function useTreeExpansion(defaultExpanded: string[] = []): TreeExpansion {
  // null = user belum mengatur apa pun, jadi masih pakai default
  const [expandedState, setExpandedState] = useState<Set<string> | null>(null);
  const expanded = expandedState ?? new Set(defaultExpanded);

  // sengaja bukan useCallback: fungsinya menutup `defaultExpanded` yang isinya
  // berubah tiap render, dan tidak ada konsumen yang di-memo
  function toggle(id: string) {
    setExpandedState((prev) => {
      const next = new Set(prev ?? defaultExpanded);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const expandAll = useCallback((ids: string[]) => setExpandedState(new Set(ids)), []);
  const collapseAll = useCallback(() => setExpandedState(new Set()), []);

  return {
    expanded,
    isOpen: (id: string) => expanded.has(id),
    toggle,
    expandAll,
    collapseAll,
  };
}
