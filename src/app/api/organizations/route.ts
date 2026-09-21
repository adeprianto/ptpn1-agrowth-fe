import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/organizations -> GET /organizations
export async function GET(request: NextRequest) {
    return forward(request, "/organizations");
}

// POST /api/organizations -> POST /organizations
export async function POST(request: NextRequest) {
    return forward(request, "/organizations");
}
