import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/training-realizations/summary -> GET /training-realizations/summary
export async function GET(request: NextRequest) {
    return forward(request, "/training-realizations/summary");
}
