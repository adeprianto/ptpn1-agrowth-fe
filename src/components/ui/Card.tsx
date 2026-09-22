import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Hilangkan padding bawaan — untuk kartu yang isinya tabel penuh */
  flush?: boolean;
}

/**
 * Panel putih bersudut membulat, pembungkus dasar hampir semua blok halaman.
 *
 * @example
 * <Card>
 *   <CardHeader title="Daftar Unit" description="Semua unit di regional ini" />
 *   <CardBody>...</CardBody>
 * </Card>
 */
export function Card({ children, className, flush = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-300 bg-white",
        !flush && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Tombol / kontrol di sisi kanan judul */
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3",
        className,
      )}
    >
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mt-4", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
