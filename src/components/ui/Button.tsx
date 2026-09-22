import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600",
  secondary: "bg-slate-400 text-white hover:bg-slate-500 focus-visible:outline-slate-500",
  outline:
    "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-slate-400",
  ghost: "text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400",
  danger: "bg-rose-500 text-white hover:bg-rose-600 focus-visible:outline-rose-500",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "gap-1.5 rounded-lg px-3 py-1.5 text-xs",
  md: "gap-2 rounded-xl px-4 py-2 text-sm",
  lg: "gap-2 rounded-xl px-4 py-2.5 text-sm",
};

const baseClass =
  "inline-flex items-center justify-center font-medium transition-colors " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ikon di kiri teks */
  icon?: LucideIcon;
  /** Tampilkan spinner dan nonaktifkan tombol */
  loading?: boolean;
  /** Lebarkan tombol mengikuti kontainer */
  block?: boolean;
  children?: ReactNode;
  className?: string;
}

function content({ icon: Icon, loading, children }: ButtonBaseProps) {
  return (
    <>
      {loading ? (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {children}
    </>
  );
}

export type ButtonProps = ButtonBaseProps &
  Omit<ComponentProps<"button">, "children" | "className">;

/**
 * Tombol standar aplikasi.
 *
 * @example
 * <Button icon={Plus}>Tambah Unit</Button>
 * <Button variant="danger" loading={saving}>Hapus</Button>
 */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  block = false,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      className={cn(
        baseClass,
        variantClass[variant],
        sizeClass[size],
        block && "w-full",
        className,
      )}
    >
      {content({ icon, loading, children })}
    </button>
  );
}

export type ButtonLinkProps = Omit<ButtonBaseProps, "loading"> &
  Omit<ComponentProps<typeof Link>, "children" | "className">;

/**
 * Versi tautan dari `Button` — tampilannya identik, tapi menghasilkan
 * `<Link>` sehingga navigasinya tetap client-side.
 *
 * @example
 * <ButtonLink href="/pegawai/create" icon={Plus}>Tambah Pegawai</ButtonLink>
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  block = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        baseClass,
        variantClass[variant],
        sizeClass[size],
        block && "w-full",
        className,
      )}
    >
      {content({ icon, children })}
    </Link>
  );
}
