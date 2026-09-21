import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/operational-categories -> GET /operational-categories
export async function GET(request: NextRequest) {
    return forward(request, "/operational-categories");
}
