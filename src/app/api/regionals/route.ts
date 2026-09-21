import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/regionals -> GET /regionals
export async function GET(request: NextRequest) {
    return forward(request, "/regionals");
}

// POST /api/regionals -> POST /regionals
export async function POST(request: NextRequest) {
    return forward(request, "/regionals");
}
