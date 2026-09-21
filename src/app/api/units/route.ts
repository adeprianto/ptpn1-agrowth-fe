import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/units -> GET /units
export async function GET(request: NextRequest) {
    return forward(request, "/units");
}

// POST /api/units -> POST /units
export async function POST(request: NextRequest) {
    return forward(request, "/units");
}
