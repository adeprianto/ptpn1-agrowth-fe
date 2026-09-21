/** app/Enums/VendorType.php — nilai kolom `classification`. */
export type VendorType = "lpp" | "internal" | "eksternal";

/** Label yang sama dengan VendorType::label() di backend. */
export const VENDOR_TYPE_LABEL: Record<VendorType, string> = {
  lpp: "Lembaga Pendidikan Perkebunan (LPP)",
  internal: "Internal PTPN Group",
  eksternal: "Eksternal PTPN Group",
};

/** app/Http/Resources/VendorResource.php */
export interface VendorResource {
  id: number;
  name: string;
  classification: VendorType | null;
  classification_label: string | null;
  is_lpp: boolean;
  phone: string | null;
  email: string | null;
  website: string | null;
  city: string | null;
  address: string | null;
  pic_name: string | null;
  pic_phone: string | null;
  pic_email: string | null;
  pic_position: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * app/Http/Requests/Vendor/StoreVendorRequest.php
 * `is_lpp` sengaja tidak ada: backend menurunkannya sendiri dari classification.
 */
export interface VendorPayload {
  name: string;
  classification: VendorType;
  phone: string | null;
  email: string | null;
  website: string | null;
  city: string | null;
  address: string | null;
  pic_name: string | null;
  pic_phone: string | null;
  pic_email: string | null;
  pic_position: string | null;
  status?: boolean;
}
