import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/position-titles -> GET /position-titles
export async function GET(request: NextRequest) {
    return forward(request, "/position-titles");
}
