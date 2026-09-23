import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/trainings -> GET /trainings
export async function GET(request: NextRequest) {
    return forward(request, "/trainings");
}

// POST /api/trainings -> POST /trainings
export async function POST(request: NextRequest) {
    return forward(request, "/trainings");
}
