"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Landmark, Network, Users } from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { TreeExpansion } from "@/hooks/useTreeExpansion";
import type { EntityTipe, StrukturNode } from "../../model/entity";
import { getJenisDisplay } from "../unit/jenisUnit";

/** Simpul cocok kalau nama/kodenya cocok, atau salah satu anaknya cocok. */
function nodeMatches(node: StrukturNode, query: string): boolean {
  if (!query) return true;

  const needle = query.toLowerCase();
  if (
    node.nama.toLowerCase().includes(needle) ||
    node.kode.toLowerCase().includes(needle)
  ) {
    return true;
  }

  return node.children.some((child) => nodeMatches(child, query));
}

// HO & Regional punya ikon tetap; Unit mengikuti kategori operasional pertamanya
function getNodeIcon(node: StrukturNode) {
  if (node.tipe === "HO") {
    return { Icon: Landmark, className: "bg-emerald-950 text-white" };
  }
  if (node.tipe === "Regional") {
    return { Icon: Network, className: "bg-blue-50 text-blue-700" };
  }

  const jenis = getJenisDisplay(node.jenis[0]);
  return { Icon: jenis.icon, className: `${jenis.iconBg} ${jenis.iconColor}` };
}

const DETAIL_HREF: Partial<Record<EntityTipe, (id: string) => string>> = {
  Regional: (id) => `/organisasi/regional/${id}`,
  Unit: (id) => `/organisasi/unit/${id}`,
};

interface OrgTreeRowProps {
  node: StrukturNode;
  level: number;
  expansion: TreeExpansion;
  /** Saat ada pencarian, semua simpul yang cocok dibuka otomatis */
  query: string;
}

export function OrgTreeRow({ node, level, expansion, query }: OrgTreeRowProps) {
  if (!nodeMatches(node, query)) return null;

  const { Icon, className: iconClass } = getNodeIcon(node);
  const hasChildren = node.children.length > 0;
  const isOpen = query !== "" ? true : expansion.isOpen(node.id);
  const highlighted =
    query !== "" && node.nama.toLowerCase().includes(query.toLowerCase());
  const href = DETAIL_HREF[node.tipe]?.(node.id);

  return (
    <div>
      <div
        className={cn(
          "group flex cursor-pointer items-center gap-2.5 rounded-lg py-2 pr-2 hover:bg-slate-50",
          highlighted && "bg-emerald-50/60",
        )}
        style={{ paddingLeft: level * 24 + 8 }}
        onClick={() => hasChildren && expansion.toggle(node.id)}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            iconClass,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>

        <span
          className={cn(
            "text-sm",
            node.tipe === "HO" ? "font-semibold text-slate-900" : "text-slate-700",
          )}
        >
          {node.nama}
        </span>
        <span className="text-xs text-slate-400">{node.kode}</span>

        {node.tipe === "Unit" &&
          node.jenis.map((item) => {
            const display = getJenisDisplay(item);
            return (
              <Badge key={item.id} tone={display.tone} className="px-1.5 py-0.5 text-[10px]">
                {display.label}
              </Badge>
            );
          })}

        {node.tipe === "Regional" && (
          <Badge tone="slate" className="px-1.5 py-0.5 text-[10px]">
            {node.children.length} Unit
          </Badge>
        )}

        <span className="ml-auto flex shrink-0 items-center gap-3">
          {href && (
            <Link
              href={href}
              onClick={(event) => event.stopPropagation()}
              className="text-xs font-medium text-emerald-600 opacity-0 hover:underline group-hover:opacity-100 focus:opacity-100"
            >
              Detail
            </Link>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Users className="h-3 w-3" />
            {formatNumber(node.totalKaryawan)}
          </span>
        </span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children.map((child) => (
            <OrgTreeRow
              key={child.id}
              node={child}
              level={level + 1}
              expansion={expansion}
              query={query}
            />
          ))}
        </div>
      )}
    </div>
  );
}
