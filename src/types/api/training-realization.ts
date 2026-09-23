/**
 * Kontrak kawat laporan realisasi pelatihan — bentuknya persis seperti yang
 * dikirim dan diterima backend (snake_case). Bentuk yang dipakai komponen ada
 * di `src/features/laporan-psdm/model/laporan.ts`.
 */
import type { EntityType } from "./entity";

/** Satu peserta seperti yang dikirim TrainingRealizationDetailResource. */
export interface TrainingRealizationDetailResource {
  id: number;
  employee_id: number;
  employee: {
    id: number;
    nik: string;
    name: string;
    jabatan: { id: number; name: string } | null;
    entity: {
      id: number;
      type: EntityType;
      name: string;
      parent: { id: number; type: EntityType; name: string } | null;
    } | null;
  } | null;
  /** Total jam selama pelatihan (jam/hari x jumlah hari) */
  experiental_learning_hours: number;
  social_learning_hours: number;
  formal_learning_hours: number;
  duration_learning_hours: number;
  learning_cost: number;
  transport_cost: number;
  perdiem_cost: number;
  /** Biaya penginapan */
  travel_expense_cost: number;
  total_cost: number;
}

/** app/Http/Resources/TrainingRealizationResource.php */
export interface TrainingRealizationResource {
  id: number;
  training_id: number | null;
  training: { id: number; name: string; vendor: { id: number; name: string } | null } | null;
  /** "offline" | "online" | "hybrid" */
  learning_method: string;
  learning_city: string | null;
  learning_location: string | null;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  learning_hours_per_day: number;
  financing_category: string;
  cost_allocation: string;
  total_participants: number;
  total_duration_learning_hours: number;
  total_cost: number;
  /** Hanya ikut di GET /training-realizations/{id} */
  details?: TrainingRealizationDetailResource[];
}

/** Satu peserta di body POST/PUT. Total jam & total biaya dihitung backend. */
export interface TrainingRealizationDetailPayload {
  employee_id: number;
  experiental_learning_hours: number;
  social_learning_hours: number;
  formal_learning_hours: number;
  learning_cost: number;
  transport_cost: number;
  perdiem_cost: number;
  travel_expense_cost: number;
}

/**
 * app/Http/Requests/TrainingRealization/StoreTrainingRealizationRequest.php
 *
 * Laporan dan seluruh pesertanya dikirim sekaligus. Saat diubah, daftar
 * peserta lama di backend diganti penuh dengan `details` ini.
 */
export interface TrainingRealizationPayload {
  training_id: number;
  learning_method: string;
  learning_city: string | null;
  learning_location: string | null;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  learning_hours_per_day: number;
  financing_category: string;
  cost_allocation: string;
  details: TrainingRealizationDetailPayload[];
}

/** GET /training-realizations/summary */
export interface TrainingRealizationSummary {
  total_cost: number;
  total_learning_hours: number;
  total_participants: number;
}
