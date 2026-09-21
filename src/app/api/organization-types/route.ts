import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/organization-types -> GET /organization-types
export async function GET(request: NextRequest) {
    return forward(request, "/organization-types");
}
