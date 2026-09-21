import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/regionals/summary -> GET /regionals/summary
export async function GET(request: NextRequest) {
    return forward(request, "/regionals/summary");
}
