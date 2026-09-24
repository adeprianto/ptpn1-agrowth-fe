import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/trainings/tags -> GET /trainings/tags
// Daftar tag unik untuk mengisi checklist filter kolom Tag.
export async function GET(request: NextRequest) {
    return forward(request, "/trainings/tags");
}
