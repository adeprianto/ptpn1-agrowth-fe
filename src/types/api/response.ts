/**
 * Bentuk respons backend (App\Traits\ApiResponse).
 * Semua endpoint membungkus datanya dengan struktur ini.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  /** Hanya ada pada endpoint yang dipaginasi (successPaginated). */
  meta?: PaginationMeta;
  /** Hanya ada pada respons error validasi (422). */
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}
