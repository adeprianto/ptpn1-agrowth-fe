"use client";

import { useState, type KeyboardEvent } from "react";
import { cn } from "cn";
import { TagChip } from "./TagChip";

/** Spasi dan koma sama-sama memisahkan tag. */
const SEPARATOR = /[\s,]+/;

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  /** Panjang maksimal satu tag; samakan dengan batas kolom di backend */
  maxLength?: number;
  /** Id untuk menyambungkan label `Field` ke kotak ketiknya */
  id?: string;
}

/**
 * Isian tag bergaya media sosial: ketik satu kata lalu tekan spasi, kata itu
 * langsung berubah jadi chip yang bisa dihapus.
 *
 * Yang memisahkan tag adalah teks yang diketik, bukan tombolnya — jadi
 * menempel (paste) "digital agribisnis sdm" sekaligus juga langsung terpecah
 * jadi tiga tag. Enter ikut menutup tag yang sedang diketik (tanpa mengirim
 * form), dan Backspace di kotak kosong menghapus tag terakhir.
 *
 * Tag kembar diabaikan tanpa memandang besar-kecil huruf, sama seperti yang
 * dilakukan backend saat menyimpan.
 *
 * @example
 * <Field label="Tag Pelatihan" hint="Ketik kata lalu tekan spasi">
 *   <TagInput value={values.tags} onChange={(tags) => setField("tags", tags)} />
 * </Field>
 */
export function TagInput({
  value,
  onChange,
  placeholder = "Ketik tag lalu tekan spasi...",
  disabled = false,
  invalid = false,
  maxLength = 100,
  id,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  /** Tambahkan beberapa kata sekaligus, lewati yang kosong atau sudah ada. */
  function addTags(words: string[]) {
    const next = [...value];

    for (const word of words) {
      const tag = word.trim().slice(0, maxLength);
      const sudahAda = next.some((item) => item.toLowerCase() === tag.toLowerCase());

      if (tag !== "" && !sudahAda) next.push(tag);
    }

    if (next.length !== value.length) onChange(next);
  }

  /**
   * Teks dipecah di setiap pemisah. Potongan terakhir belum tentu selesai
   * diketik, jadi dia yang tetap tinggal di kotak ketik.
   */
  function handleChange(text: string) {
    const parts = text.split(SEPARATOR);
    const unfinished = parts.pop() ?? "";

    if (parts.length > 0) addTags(parts);
    setDraft(unfinished.slice(0, maxLength));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      // tanpa ini, Enter mengirim form padahal maksud pengguna menutup tag
      event.preventDefault();
      addTags([draft]);
      setDraft("");
      return;
    }

    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((item) => item !== tag));
  }

  return (
    <div
      className={cn(
        // tata letak — chip membungkus ke baris berikutnya kalau tidak muat
        "flex w-full flex-wrap items-center gap-1.5",
        // tampilan
        "rounded-xl border bg-white p-2",
        // interaksi
        "focus-within:ring-2",
        // keadaan
        invalid
          ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/20"
          : "border-slate-300 focus-within:border-emerald-500 focus-within:ring-emerald-500/20",
        disabled && "cursor-not-allowed bg-slate-50",
      )}
    >
      {value.map((tag) => (
        <TagChip
          key={tag}
          label={tag}
          onRemove={disabled ? undefined : () => removeTag(tag)}
        />
      ))}

      <input
        id={id}
        type="text"
        value={draft}
        disabled={disabled}
        placeholder={value.length === 0 ? placeholder : ""}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        // kata yang sedang diketik ikut jadi tag saat fokus pindah, supaya
        // tidak hilang diam-diam ketika pengguna langsung menekan Simpan
        onBlur={() => {
          addTags([draft]);
          setDraft("");
        }}
        className={cn(
          // tata letak
          "min-w-32 flex-1",
          // tampilan — kotak ketiknya polos, rangkanya milik pembungkus di atas
          "border-0 bg-transparent px-1 py-0.5",
          // teks
          "text-sm text-slate-700 placeholder:text-slate-400",
          // interaksi
          "focus:outline-none disabled:cursor-not-allowed",
        )}
      />
    </div>
  );
}
