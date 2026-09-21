import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/employees -> GET /employees
export async function GET(request: NextRequest) {
    return forward(request, "/employees");
}
