"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MoreVertical, type LucideIcon } from "lucide-react";

export interface RowAction {
  label: string;
  icon?: LucideIcon;
  /** Isi salah satu: href untuk navigasi, atau onClick untuk aksi */
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface RowActionMenuProps {
  actions: RowAction[];
  /** Dibacakan screen reader, mis. "Aksi untuk Regional 1" */
  label?: string;
}

const MENU_WIDTH = 176; // w-44

/**
 * Menu aksi per baris tabel (titik tiga). Dipakai supaya kolom Action tidak
 * memakan ruang. Panel dirender lewat portal karena pembungkus tabel memakai
 * `overflow-x-auto` yang akan memotong dropdown biasa.
 */
export function RowActionMenu({ actions, label = "Aksi" }: RowActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    // posisi panel mengikuti tombol, jadi menu ikut tertutup saat halaman digulir
    function close() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom;
      const estimatedHeight = actions.length * 40 + 16;
      // buka ke atas kalau ruang di bawah tidak cukup
      const top =
        spaceBelow < estimatedHeight
          ? rect.top - estimatedHeight - 4
          : rect.bottom + 4;

      setPosition({
        top,
        left: Math.max(8, rect.right - MENU_WIDTH),
      });
    }

    setOpen(true);
  }

  const itemClass = (action: RowAction) =>
    `flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
      action.variant === "danger"
        ? "text-rose-600 hover:bg-rose-50"
        : "text-slate-600 hover:bg-slate-50"
    } ${action.disabled ? "cursor-not-allowed opacity-50" : ""}`;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 ${
          open ? "bg-slate-100 text-slate-600" : ""
        }`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              const content = (
                <>
                  {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                  {action.label}
                </>
              );

              if (action.href && !action.disabled) {
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={itemClass(action)}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  disabled={action.disabled}
                  onClick={() => {
                    setOpen(false);
                    action.onClick?.();
                  }}
                  className={itemClass(action)}
                >
                  {content}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
