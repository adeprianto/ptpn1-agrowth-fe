"use client";

import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { RowActionMenu } from "@/components/shared/RowActionMenu";
import { Badge } from "@/components/ui";
import type { TreeExpansion } from "@/hooks/useTreeExpansion";
import type { DepartemenNode } from "../../model/departemen";

interface DepartemenTreeRowProps {
  node: DepartemenNode;
  depth: number;
  expansion: TreeExpansion;
  onDelete: (node: DepartemenNode) => void;
}

export function DepartemenTreeRow({
  node,
  depth,
  expansion,
  onDelete,
}: DepartemenTreeRowProps) {
  const hasChildren = node.children.length > 0;
  const isOpen = expansion.isOpen(node.id);

  return (
    <div>
      <div
        className="flex items-center gap-2.5 rounded-lg py-2 pr-2 hover:bg-slate-50"
        style={{ paddingLeft: depth * 24 + 8 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => expansion.toggle(node.id)}
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
          {node.nama}
          <span className="ml-2 text-xs font-normal text-slate-400">{node.kode}</span>
        </span>

        {node.tipe && (
          <Badge tone="slate" className="px-2 py-0.5 text-[11px]">
            {node.tipe.nama}
          </Badge>
        )}

        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
          {node.jobFunction?.nama ?? "-"}
        </span>

        <div className="ml-2 shrink-0">
          <RowActionMenu
            label={`Aksi untuk ${node.nama}`}
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
                onClick: () => onDelete(node),
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
              expansion={expansion}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
