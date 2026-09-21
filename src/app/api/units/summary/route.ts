import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/units/summary -> GET /units/summary
export async function GET(request: NextRequest) {
    return forward(request, "/units/summary");
}
