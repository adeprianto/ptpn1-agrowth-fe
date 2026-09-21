import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/head-office -> GET /head-office
export async function GET(request: NextRequest) {
    return forward(request, "/head-office");
}
