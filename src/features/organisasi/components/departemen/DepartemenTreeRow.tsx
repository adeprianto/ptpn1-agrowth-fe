"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  getFunctionName,
  type StrukturDepartemenNode,
} from "./masterJabatanDummyData";

interface DepartemenTreeRowProps {
  node: StrukturDepartemenNode;
  allNodes: StrukturDepartemenNode[];
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onDeleteClick: (node: StrukturDepartemenNode) => void;
}

export function DepartemenTreeRow({
  node,
  allNodes,
  depth,
  expanded,
  onToggle,
  onDeleteClick,
}: DepartemenTreeRowProps) {
  const children = allNodes.filter((n) => n.parentId === node.id);
  const hasChildren = children.length > 0;
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
        </span>

        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          {node.type}
        </span>

        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
          {node.functionCode ? getFunctionName(node.functionCode) : "-"}
        </span>

        <div className="ml-2 flex shrink-0 gap-1.5">
          <Link
            href={`/organisasi/departemen/${node.id}/edit`}
            className="rounded-lg bg-blue-500 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-600"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDeleteClick(node)}
            className="rounded-lg bg-rose-500 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-rose-600"
          >
            Hapus
          </button>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div>
          {children.map((child) => (
            <DepartemenTreeRow
              key={child.id}
              node={child}
              allNodes={allNodes}
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
