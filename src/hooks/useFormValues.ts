"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

/**
 * State isian form yang otomatis terisi begitu data yang diedit selesai dimuat.
 *
 * Pengisiannya dilakukan saat render (pola resmi React "adjusting state when
 * props change"), bukan lewat `useEffect`, supaya form tidak sempat tampil
 * kosong satu frame lebih dulu.
 *
 * @param source Data sumber; `null` selama belum dimuat
 * @param map    Ubah data sumber jadi isian form
 * @param initial Isian awal untuk mode tambah
 *
 * @example
 * const detail = useAsyncData((signal) => getUnit(id, signal), { deps: [id] });
 * const [values, setValues] = useFormValues(detail.data, toUnitFormValues, emptyForm);
 */
export function useFormValues<TSource, TValues>(
  source: TSource | null,
  map: (source: TSource) => TValues,
  initial: TValues,
): [TValues, Dispatch<SetStateAction<TValues>>] {
  const [values, setValues] = useState<TValues>(initial);
  const [applied, setApplied] = useState<TSource | null>(null);

  if (source !== null && source !== applied) {
    setApplied(source);
    setValues(map(source));
  }

  return [values, setValues];
}
