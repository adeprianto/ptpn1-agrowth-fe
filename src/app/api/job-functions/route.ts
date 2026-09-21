import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

// GET /api/job-functions -> GET /job-functions
export async function GET(request: NextRequest) {
    return forward(request, "/job-functions");
}
