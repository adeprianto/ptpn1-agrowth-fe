import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/training-realizations -> GET /training-realizations
export async function GET(request: NextRequest) {
    return forward(request, "/training-realizations");
}

// POST /api/training-realizations -> POST /training-realizations
export async function POST(request: NextRequest) {
    return forward(request, "/training-realizations");
}
