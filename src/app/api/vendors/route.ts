import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/vendors -> GET /vendors
export async function GET(request: NextRequest) {
    return forward(request, "/vendors");
}

// POST /api/vendors -> POST /vendors
export async function POST(request: NextRequest) {
    return forward(request, "/vendors");
}
