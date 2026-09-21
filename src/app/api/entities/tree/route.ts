import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/entities/tree -> GET /entities/tree
export async function GET(request: NextRequest) {
    return forward(request, "/entities/tree");
}
