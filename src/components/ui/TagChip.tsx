import { X } from "lucide-react";
import { cn } from "cn";

/**
 * Pilihan warna chip tag.
 *
 * Semuanya satu tingkat kelembutan yang sama (latar -50, teks -700, garis
 * -200) dan warnanya dipilih yang bertetangga dengan hijau tema aplikasi,
 * jadi chip terlihat bermacam-macam tanpa ada yang menonjol atau bertabrakan
 * dengan tombol dan badge status. Merah sengaja tidak dipakai karena di
 * aplikasi ini warna itu berarti error atau non-aktif.
 *
 * Kelasnya ditulis utuh satu per satu — Tailwind memindai kode sumber apa
 * adanya, jadi kelas yang dirakit dengan template string tidak akan ikut
 * dibuat.
 */
const TAG_TONES = [
  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "bg-teal-50 text-teal-700 ring-teal-200",
  "bg-cyan-50 text-cyan-700 ring-cyan-200",
  "bg-sky-50 text-sky-700 ring-sky-200",
  "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "bg-violet-50 text-violet-700 ring-violet-200",
  "bg-lime-50 text-lime-700 ring-lime-200",
  "bg-amber-50 text-amber-700 ring-amber-200",
];

/**
 * Warna sebuah tag, diturunkan dari namanya.
 *
 * Sengaja bukan acak sungguhan: kalau diacak, warna tag yang sama akan
 * berganti setiap tabel dirender ulang. Dengan diturunkan dari nama, "Digital"
 * selalu berwarna sama di baris mana pun dan di halaman mana pun.
 */
export function tagToneClass(tag: string): string {
  let sum = 0;

  for (const char of tag.toLowerCase()) {
    sum += char.codePointAt(0) ?? 0;
  }

  return TAG_TONES[sum % TAG_TONES.length];
}

interface TagChipProps {
  label: string;
  /** Kalau diisi, chip mendapat tombol silang untuk menghapusnya */
  onRemove?: () => void;
  className?: string;
}

/**
 * Satu tag berbentuk pil berwarna.
 *
 * @example
 * <TagChip label="Digital" />
 * <TagChip label="Digital" onRemove={() => hapus("Digital")} />
 */
export function TagChip({ label, onRemove, className }: TagChipProps) {
  return (
    <span
      className={cn(
        // tata letak
        "inline-flex max-w-full items-center gap-1",
        // tampilan
        "rounded-full px-2.5 py-0.5 ring-1 ring-inset",
        // teks
        "text-xs font-medium",
        // warna diturunkan dari nama tagnya
        tagToneClass(label),
        className,
      )}
    >
      <span className="truncate">{label}</span>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Hapus tag ${label}`}
          className="-mr-0.5 shrink-0 rounded-full p-0.5 opacity-60 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

interface TagChipListProps {
  tags: string[];
  /** Ditampilkan kalau tidak ada tag sama sekali */
  emptyText?: string;
  className?: string;
}

/**
 * Sederet tag, membungkus ke baris berikutnya kalau tidak muat.
 * Dipakai di sel tabel atau di mana pun tag cuma perlu ditampilkan.
 *
 * @example
 * <TagChipList tags={pelatihan.tags} />
 */
export function TagChipList({ tags, emptyText = "-", className }: TagChipListProps) {
  if (tags.length === 0) {
    return <span className="text-slate-300">{emptyText}</span>;
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tags.map((tag) => (
        <TagChip key={tag} label={tag} />
      ))}
    </div>
  );
}
