import { cn } from "@/lib/cn";

const sizeClass = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
} as const;

interface SpinnerProps {
  size?: keyof typeof sizeClass;
  className?: string;
  /** Teks untuk pembaca layar */
  label?: string;
}

/** Indikator memuat berbentuk cincin berputar. */
export function Spinner({ size = "md", className, label = "Memuat" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-emerald-600",
        sizeClass[size],
        className,
      )}
    />
  );
}
