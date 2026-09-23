import type { ReactNode } from "react";
import { cn } from "cn";

/**
 * Besar ruang dalam kartu. Dipilih lewat prop, bukan lewat `className`,
 * karena `cn` di proyek ini hanya menggabungkan kelas apa adanya — menimpa
 * `p-4 sm:p-5` dengan `p-6` menghasilkan dua aturan yang saling berebut dan
 * yang menang ditentukan urutan CSS Tailwind, bukan urutan penulisannya.
 */
export type CardPadding = "normal" | "roomy" | "none";

const paddingClass: Record<CardPadding, string> = {
  none: "",
  normal: "p-4 sm:p-5",
  roomy: "p-4 sm:p-6",
};

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Ruang dalam kartu; `none` untuk kartu yang isinya tabel penuh */
  padding?: CardPadding;
  /** @deprecated pakai `padding="none"` */
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
export function Card({
  children,
  className,
  padding = "normal",
  flush = false,
}: CardProps) {
  return (
    <div
      className={cn(
        // tampilan
        "rounded-2xl border border-slate-300 bg-white",
        // jarak dalam — ikut ukuran layar, lihat paddingClass
        paddingClass[flush ? "none" : padding],
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
        // tata letak
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
        // tata letak
        "flex flex-wrap items-center justify-end gap-2",
        // jarak
        "mt-5 pt-4",
        // tampilan
        "border-t border-slate-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
