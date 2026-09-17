"use client";

import {
  ChevronDown,
  ChevronRight,
  Factory,
  Landmark,
  Network,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { OrgNode, OrgNodeType } from "./strukturOrganisasiDummyData";

const nodeIcon: Record<OrgNodeType, LucideIcon> = {
  ho: Landmark,
  regional: Network,
  kebun: Sprout,
  pabrik: Factory,
};

const nodeIconColorClass: Record<OrgNodeType, string> = {
  ho: "bg-emerald-950 text-white",
  regional: "bg-blue-50 text-blue-700",
  kebun: "bg-emerald-50 text-emerald-700",
  pabrik: "bg-amber-50 text-amber-700",
};

// Cuma Kebun & Pabrik yang dapat badge jenis di desain
const typeBadgeClass: Partial<Record<OrgNodeType, string>> = {
  kebun: "bg-emerald-50 text-emerald-700",
  pabrik: "bg-amber-50 text-amber-700",
};

const typeBadgeLabel: Partial<Record<OrgNodeType, string>> = {
  kebun: "Kebun",
  pabrik: "Pabrik",
};

function nodeMatches(node: OrgNode, query: string): boolean {
  if (!query) return true;
  if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
  return node.children?.some((child) => nodeMatches(child, query)) ?? false;
}

interface OrgTreeRowProps {
  node: OrgNode;
  level: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
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

  const Icon = nodeIcon[node.type];
  const hasChildren = !!node.children && node.children.length > 0;
  const isOpen = query !== "" ? true : expanded.has(node.id);
  const highlighted =
    query !== "" && node.name.toLowerCase().includes(query.toLowerCase());

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-2.5 rounded-lg py-2 pr-2 hover:bg-slate-50 ${
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
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${nodeIconColorClass[node.type]}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>

        <span
          className={`text-sm ${
            node.type === "ho"
              ? "font-semibold text-slate-900"
              : "text-slate-700"
          }`}
        >
          {node.name}
        </span>

        {typeBadgeLabel[node.type] && (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${typeBadgeClass[node.type]}`}
          >
            {typeBadgeLabel[node.type]}
          </span>
        )}

        <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-slate-400">
          <Users className="h-3 w-3" />
          {node.employeeCount}
        </span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children!.map((child) => (
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
