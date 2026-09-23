"use client";

import { useRef, type ChangeEvent } from "react";
import { cn } from "cn";
import { Input, type InputProps } from "./Input";

/** "7500000" -> "7.500.000" (titik ribuan Rupiah); kosong tetap kosong. */
function formatDigits(digits: string): string {
  return digits === "" ? "" : Number(digits).toLocaleString("id-ID");
}

/** "Rp 7.500.000" / "7.500.000" / "7500000" -> "7500000"; buang nol di depan. */
function toDigits(text: string): string {
  return text.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

type CurrencyInputProps = Omit<InputProps, "value" | "onChange" | "type"> & {
  /** Angka murni tanpa titik, mis. "7500000"; "" berarti belum diisi */
  value: string;
  /** Menerima angka murni tanpa titik, siap disimpan atau dihitung */
  onValueChange: (digits: string) => void;
};

/**
 * Isian nilai uang dalam Rupiah. Titik ribuan muncul otomatis saat mengetik
 * (7500000 -> Rp 7.500.000), tetapi yang disimpan tetap angka murni.
 *
 * Alurnya: user mengetik -> ambil angkanya saja (`toDigits`) -> kirim lewat
 * `onValueChange` -> nilai baru ditampilkan lagi dengan titik (`formatDigits`).
 *
 * @example
 * <CurrencyInput value={values.biaya} onValueChange={(v) => setField("biaya", v)} />
 */
export function CurrencyInput({ value, onValueChange, className, ...rest }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    // Titik yang ditambahkan otomatis bisa menggeser kursor ke akhir. Supaya
    // mengetik di tengah angka tetap nyaman, catat berapa angka di kiri kursor
    // lalu kembalikan kursor ke posisi itu setelah tampilan diperbarui.
    const digitsBeforeCaret = toDigits(input.value.slice(0, input.selectionStart ?? 0)).length;
    const digits = toDigits(input.value);

    onValueChange(digits);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el || document.activeElement !== el) return;

      let position = 0;
      let seen = 0;
      while (position < el.value.length && seen < digitsBeforeCaret) {
        if (/\d/.test(el.value[position])) seen++;
        position++;
      }
      el.setSelectionRange(position, position);
    });
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
        Rp
      </span>
      <Input
        {...rest}
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={formatDigits(value)}
        onChange={handleChange}
        className={cn("pl-10 text-right tabular-nums", className)}
      />
    </div>
  );
}
