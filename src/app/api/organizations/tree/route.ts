import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/organizations/tree -> GET /organizations/tree
export async function GET(request: NextRequest) {
    return forward(request, "/organizations/tree");
}
