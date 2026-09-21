"use client";

import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { RowActionMenu } from "@/components/shared/RowActionMenu";
import type { OrganizationTreeNode } from "@/types/api/organization";

interface DepartemenTreeRowProps {
  node: OrganizationTreeNode;
  depth: number;
  expanded: Set<number>;
  onToggle: (id: number) => void;
  onDeleteClick: (node: OrganizationTreeNode) => void;
}

export function DepartemenTreeRow({
  node,
  depth,
  expanded,
  onToggle,
  onDeleteClick,
}: DepartemenTreeRowProps) {
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(node.id);

  return (
    <div>
      <div
        className="flex items-center gap-2.5 rounded-lg py-2 pr-2 hover:bg-slate-50"
        style={{ paddingLeft: depth * 24 + 8 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            className="shrink-0"
            aria-label={isOpen ? "Ciutkan" : "Perluas"}
          >
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
          {node.name}
          <span className="ml-2 text-xs font-normal text-slate-400">
            {node.code}
          </span>
        </span>

        {node.organization_type && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {node.organization_type.name}
          </span>
        )}

        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
          {node.job_function?.name ?? "-"}
        </span>

        <div className="ml-2 shrink-0">
          <RowActionMenu
            label={`Aksi untuk ${node.name}`}
            actions={[
              {
                label: "Edit",
                icon: Pencil,
                href: `/organisasi/departemen/${node.id}/edit`,
              },
              {
                label: "Hapus",
                icon: Trash2,
                variant: "danger",
                onClick: () => onDeleteClick(node),
              },
            ]}
          />
        </div>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children.map((child) => (
            <DepartemenTreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
