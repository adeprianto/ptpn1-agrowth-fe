import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/business-types -> GET /business-types
export async function GET(request: NextRequest) {
    return forward(request, "/business-types");
}
