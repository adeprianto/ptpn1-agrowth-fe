import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/employees/summary -> GET /employees/summary
export async function GET(request: NextRequest) {
    return forward(request, "/employees/summary");
}
