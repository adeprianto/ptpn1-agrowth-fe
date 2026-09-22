import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/employees/filter-options -> GET /employees/filter-options
// Isi checklist filter di header kolom tabel pegawai; sudah di-scope backend.
export async function GET(request: NextRequest) {
    return forward(request, "/employees/filter-options");
}
