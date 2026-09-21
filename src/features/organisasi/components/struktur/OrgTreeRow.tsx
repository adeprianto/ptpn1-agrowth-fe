"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Landmark,
  Network,
  Users,
} from "lucide-react";
import type { EntityTreeNode } from "@/types/api/entity";
import { getJenisDisplay } from "../unit/jenisUnit";

function nodeMatches(node: EntityTreeNode, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (node.name.toLowerCase().includes(q) || node.code.toLowerCase().includes(q)) {
    return true;
  }
  return node.children.some((child) => nodeMatches(child, query));
}

// HO & Regional punya icon tetap; Unit mengikuti kategori operasional pertamanya
function getNodeIcon(node: EntityTreeNode) {
  if (node.type === "HEAD_OFFICE") {
    return { Icon: Landmark, className: "bg-emerald-950 text-white" };
  }
  if (node.type === "REGIONAL") {
    return { Icon: Network, className: "bg-blue-50 text-blue-700" };
  }
  const jenis = getJenisDisplay(node.jenis[0]);
  return { Icon: jenis.icon, className: `${jenis.iconBg} ${jenis.iconColor}` };
}

const detailHref: Partial<Record<EntityTreeNode["type"], (id: number) => string>> = {
  REGIONAL: (id) => `/organisasi/regional/${id}`,
  UNIT: (id) => `/organisasi/unit/${id}`,
};

interface OrgTreeRowProps {
  node: EntityTreeNode;
  level: number;
  expanded: Set<number>;
  onToggle: (id: number) => void;
  query: string;
}

export function OrgTreeRow({
  node,
  level,
  expanded,
  onToggle,
  query,
}: OrgTreeRowProps) {
  if (!nodeMatches(node, query)) return null;

  const { Icon, className: iconClass } = getNodeIcon(node);
  const hasChildren = node.children.length > 0;
  const isOpen = query !== "" ? true : expanded.has(node.id);
  const highlighted =
    query !== "" && node.name.toLowerCase().includes(query.toLowerCase());
  const href = detailHref[node.type]?.(node.id);

  return (
    <div>
      <div
        className={`group flex cursor-pointer items-center gap-2.5 rounded-lg py-2 pr-2 hover:bg-slate-50 ${
          highlighted ? "bg-emerald-50/60" : ""
        }`}
        style={{ paddingLeft: level * 24 + 8 }}
        onClick={() => hasChildren && onToggle(node.id)}
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
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>

        <span
          className={`text-sm ${
            node.type === "HEAD_OFFICE"
              ? "font-semibold text-slate-900"
              : "text-slate-700"
          }`}
        >
          {node.name}
        </span>
        <span className="text-xs text-slate-400">{node.code}</span>

        {node.type === "UNIT" &&
          node.jenis.map((j) => {
            const display = getJenisDisplay(j);
            return (
              <span
                key={j.id}
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${display.badgeClass}`}
              >
                {display.label}
              </span>
            );
          })}

        {node.type === "REGIONAL" && (
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            {node.children.length} Unit
          </span>
        )}

        <span className="ml-auto flex shrink-0 items-center gap-3">
          {href && (
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-emerald-600 opacity-0 hover:underline group-hover:opacity-100 focus:opacity-100"
            >
              Detail
            </Link>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Users className="h-3 w-3" />
            {node.total_karyawan.toLocaleString("id-ID")}
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
              expanded={expanded}
              onToggle={onToggle}
              query={query}
            />
          ))}
        </div>
      )}
    </div>
  );
}
